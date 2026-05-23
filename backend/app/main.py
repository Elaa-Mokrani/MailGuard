from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.openapi.docs import get_swagger_ui_html
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import HTMLResponse

from app.api.routes import router
from app.core.config import get_settings
from app.services.inference import inference_service


settings = get_settings()


@asynccontextmanager
async def lifespan(_: FastAPI):
    if not inference_service.ready:
        inference_service.reload()
    yield


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    debug=settings.debug,
    lifespan=lifespan,
    docs_url=None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix=settings.api_prefix)


@app.get("/docs", include_in_schema=False)
def custom_swagger_ui() -> HTMLResponse:
    html = get_swagger_ui_html(
        openapi_url=app.openapi_url or "/openapi.json",
        title=f"{settings.app_name} - API",
    )
    body = html.body.decode("utf-8").replace(
        "</head>",
        """
        <style>
          .swagger-ui .download-url-wrapper { display: none !important; }
          .swagger-ui .info .base-url { display: none !important; }
          .swagger-ui .info a[href] { display: none !important; }
          .swagger-ui .info a[href*="openapi"] { display: none !important; }
          .swagger-ui .info > div > a { display: none !important; }
        </style>
        </head>
        """,
    ).replace(
        "</body>",
        """
        <script>
          const hideOpenApiLink = () => {
            document.querySelectorAll('.swagger-ui .info a').forEach((link) => {
              const href = link.getAttribute('href') || '';
              const text = link.textContent || '';
              if (href.includes('openapi') || text.includes('/openapi.json')) {
                link.style.display = 'none';
                link.setAttribute('aria-hidden', 'true');
              }
            });
          };
          window.addEventListener('load', () => {
            hideOpenApiLink();
            setTimeout(hideOpenApiLink, 300);
            setTimeout(hideOpenApiLink, 1200);
          });
        </script>
        </body>
        """,
    )
    return HTMLResponse(body)


@app.get("/", tags=["system"])
def root() -> dict[str, str]:
    return {
        "name": settings.app_name,
        "version": settings.app_version,
        "docs": "/docs",
        "health": f"{settings.api_prefix}/health",
    }
