import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Mail,
  CheckCircle,
  Edit,
  User,
  Calendar,
  FileText,
  DollarSign,
  Smile,
  Frown,
  Meh,
  AlertTriangle,
  Hash,
  Building2,
  Save,
  X,
  Sparkles,
  Copy,
} from "lucide-react";
import { useAPI } from "../hooks/useAPI";
import { EmailCardSkeleton } from "../components/SkeletonLoader";
import { LanguageBadge } from "../components/LanguageBadge";
import { EmailFilters } from "../components/EmailFilters";
import { DatasetInfo } from "../components/DatasetInfo";
import { useFilters } from "../hooks/useFilters";
import { getEmails, suggestReply, type FrontEmail } from "../lib/api";
import { addUserHistoryEvent } from "../lib/history";
import { getRiskBadgeStyle, normalizeRiskLevel } from "../lib/risk";

const VALIDATED_EMAILS_STORAGE_KEY = "mailguard_validated_email_ids";

export default function EmailAnalysis() {
  const [selectedEmail, setSelectedEmail] = useState<FrontEmail | null>(null);
  const [localEmails, setLocalEmails] = useState<FrontEmail[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [draftEmail, setDraftEmail] = useState<FrontEmail | null>(null);
  const [validated, setValidated] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(VALIDATED_EMAILS_STORAGE_KEY) || "[]");
    } catch {
      return [];
    }
  });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [suggestedReply, setSuggestedReply] = useState("");
  const [suggestedReplyError, setSuggestedReplyError] = useState("");
  const [isGeneratingReply, setIsGeneratingReply] = useState(false);

  const { data: emailsData, loading, error, refetch } = useAPI(() => getEmails(250), {
    delay: 0,
  });

  useEffect(() => {
    if (emailsData) {
      setLocalEmails(emailsData);
    }
  }, [emailsData]);

  const { filters, filteredEmails, updateFilter, resetFilters } = useFilters(localEmails);

  useEffect(() => {
    if (!selectedEmail && filteredEmails.length > 0) {
      setSelectedEmail(filteredEmails[0]);
      return;
    }

    if (selectedEmail && filteredEmails.every((email) => email.email_id !== selectedEmail.email_id)) {
      setSelectedEmail(filteredEmails[0] ?? null);
    }
  }, [filteredEmails, selectedEmail]);

  const getRiskBadge = (technicite = 0, risque?: string | null) => {
    const level = normalizeRiskLevel(risque, technicite);
    const style = getRiskBadgeStyle(level);
    return { label: style.label, color: style.className, level };
  };

  const getSentimentIcon = (sentiment = "neutral") => {
    switch (sentiment) {
      case "positive":
        return <Smile className="w-4 h-4 text-primary" />;
      case "negative":
        return <Frown className="w-4 h-4 text-destructive" />;
      default:
        return <Meh className="w-4 h-4 text-[#B983FF]" />;
    }
  };

  const getHealthColor = (sante: string) => {
    switch (sante) {
      case "EXCELLENTE":
        return "text-primary";
      case "BONNE":
        return "text-[#10B981]";
      case "MOYENNE":
        return "text-[#F59E0B]";
      case "RISQUEE":
      case "RISQUÉE":
      case "RISQUÃ‰E":
        return "text-[#EF4444]";
      case "FRAGILE":
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  };

  const handleValidate = () => {
    if (!selectedEmail) return;
    setValidated((previous) => {
      const next = Array.from(new Set([...previous, selectedEmail.email_id]));
      localStorage.setItem(VALIDATED_EMAILS_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    addUserHistoryEvent({
      type: "validation",
      client: selectedEmail.client_nom,
      titre: "Analyse validee",
      description: `${selectedEmail.type_email} - ${getRiskBadge(selectedEmail.technicite, selectedEmail.risque_impaye).label}`,
      statut: getRiskBadge(selectedEmail.technicite, selectedEmail.risque_impaye).level === "eleve" ? "prioritaire" : "succes",
    });
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const handleEdit = () => {
    if (!selectedEmail) return;
    setDraftEmail({ ...selectedEmail });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setDraftEmail(null);
    setIsEditing(false);
  };

  const handleDraftChange = <K extends keyof FrontEmail>(key: K, value: FrontEmail[K]) => {
    setDraftEmail((current) => (current ? { ...current, [key]: value } : current));
  };

  const handleSaveEdit = () => {
    if (!draftEmail) return;
    setLocalEmails((current) =>
      current.map((email) => (email.email_id === draftEmail.email_id ? draftEmail : email))
    );
    setSelectedEmail(draftEmail);
    setIsEditing(false);
    setDraftEmail(null);
  };

  const handleSuggestReply = async () => {
    if (!selectedEmail) return;
    setIsGeneratingReply(true);
    setSuggestedReply("");
    setSuggestedReplyError("");

    try {
      const response = await suggestReply({
        email_content: [selectedEmail.sujet, selectedEmail.corps].filter(Boolean).join("\n\n"),
        analysis: {
          type_email: selectedEmail.type_email,
          sentiment: selectedEmail.sentiment,
          urgence: selectedEmail.priorite,
          risque: getRiskBadge(selectedEmail.technicite, selectedEmail.risque_impaye).label,
          langue: selectedEmail.langue,
          interne: Boolean(selectedEmail.interne),
          client_nom: selectedEmail.client_nom,
          montant: selectedEmail.montant ?? null,
          reference_facture: selectedEmail.reference_facture ?? null,
        },
      });
      setSuggestedReply(response.suggested_reply);
      addUserHistoryEvent({
        type: "suggestion",
        client: selectedEmail.client_nom,
        titre: "Reponse suggeree generee",
        description: `${selectedEmail.type_email} - ${selectedEmail.langue} - ${selectedEmail.interne ? "interne" : "externe"}`,
        statut: "succes",
      });
    } catch (error) {
      setSuggestedReplyError(
        error instanceof Error
          ? error.message
          : "Impossible de generer une reponse suggeree pour le moment."
      );
    } finally {
      setIsGeneratingReply(false);
    }
  };

  const handleCopySuggestedReply = async () => {
    if (!suggestedReply) return;
    await navigator.clipboard.writeText(suggestedReply);
  };

  const handleCloseSuggestedReply = () => {
    setSuggestedReply("");
    setSuggestedReplyError("");
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 2,
    }).format(amount);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const hasValidAmount = (amount?: number | null) => typeof amount === "number" && amount > 0;
  const hasInvoiceReference = (reference?: string | null) => typeof reference === "string" && reference.trim().length > 0;

  const CodixBadge = () => (
    <div className="inline-flex items-center gap-1 rounded-xl border border-[#0EA5E9]/20 bg-white px-2 py-1 shadow-sm">
      {["C", "o", "d", "i"].map((letter) => (
        <span
          key={letter}
          className="flex h-6 w-6 items-center justify-center rounded-md bg-[#0EA5E9] text-xs font-semibold text-white"
        >
          {letter}
        </span>
      ))}
      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#D81B60] text-xs font-semibold text-white">
        X
      </span>
    </div>
  );

  return (
    <div className="space-y-6">
      <DatasetInfo />

      <EmailFilters
        filters={filters}
        onFilterChange={updateFilter}
        onReset={resetFilters}
        totalResults={filteredEmails.length}
      />

      <AnimatePresence>
        {showSuccessMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 right-8 z-50 bg-primary text-primary-foreground px-6 py-4 rounded-xl shadow-lg flex items-center gap-3"
          >
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Analyse validee avec succes !</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(isGeneratingReply || suggestedReply || suggestedReplyError) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center bg-black/20 px-4 pt-24"
          >
            <motion.div
              initial={{ opacity: 0, y: -18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -18, scale: 0.98 }}
              className="w-full max-w-3xl rounded-2xl border border-border bg-card p-6 shadow-2xl"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-secondary" />
                  <h3 className="text-base font-semibold text-foreground">Reponse suggeree</h3>
                </div>
                <button
                  onClick={handleCloseSuggestedReply}
                  className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {isGeneratingReply ? (
                <div className="rounded-xl border border-secondary/20 bg-secondary/10 p-4 text-sm text-foreground">
                  Generation de la reponse personnalisee en cours...
                </div>
              ) : suggestedReplyError ? (
                <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
                  {suggestedReplyError}
                </div>
              ) : (
                <>
                  <div className="max-h-[50vh] overflow-y-auto whitespace-pre-line rounded-xl bg-muted p-4 text-sm leading-relaxed text-foreground">
                    {suggestedReply}
                  </div>
                  <div className="mt-4 flex justify-end gap-3">
                    <button
                      onClick={handleCopySuggestedReply}
                      className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground transition-opacity hover:opacity-90"
                    >
                      <Copy className="h-4 w-4" />
                      Copier
                    </button>
                    <button
                      onClick={handleCloseSuggestedReply}
                      className="rounded-lg bg-muted px-4 py-2 text-sm text-foreground transition-colors hover:bg-muted/80"
                    >
                      Fermer
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-6 h-[calc(100vh-16rem)] min-h-[600px]">
        <div className="w-2/5 bg-card rounded-2xl shadow-sm border border-border flex flex-col overflow-hidden">
          <div className="p-5 border-b border-border flex-shrink-0">
            <h2 className="text-lg font-medium text-foreground mb-1">Emails analyses par le modele</h2>
            <p className="text-sm text-muted-foreground">{filteredEmails.length} emails charges depuis le dataset reel</p>
          </div>
          <div className="flex-1 overflow-y-auto overscroll-contain">
            {loading ? (
              <>
                <EmailCardSkeleton />
                <EmailCardSkeleton />
                <EmailCardSkeleton />
                <EmailCardSkeleton />
              </>
            ) : error ? (
              <div className="flex items-center justify-center h-full p-6">
                <div className="text-center text-muted-foreground space-y-3">
                  <AlertTriangle className="w-12 h-12 mx-auto opacity-50" />
                  <p className="text-sm">Le backend n'a pas repondu.</p>
                  <button onClick={refetch} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground">
                    Reessayer
                  </button>
                </div>
              </div>
            ) : filteredEmails.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-muted-foreground">
                  <Mail className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Aucun email ne correspond aux filtres</p>
                </div>
              </div>
            ) : (
              filteredEmails.map((email, index) => {
                const badge = getRiskBadge(email.technicite, email.risque_impaye);
                const isSelected = selectedEmail?.email_id === email.email_id;
                const isValidated = validated.includes(email.email_id);

                return (
                  <motion.div
                    key={email.email_id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => {
                      setSelectedEmail(email);
                      setIsEditing(false);
                      setDraftEmail(null);
                      setSuggestedReply("");
                      setSuggestedReplyError("");
                    }}
                    whileHover={{ x: 4 }}
                    className={`p-5 border-b border-border cursor-pointer transition-all duration-200 relative ${
                      isSelected ? "bg-muted shadow-sm" : "hover:bg-muted/50"
                    }`}
                  >
                    {isValidated && (
                      <div className="absolute top-2 right-2">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-6 h-6 bg-primary rounded-full flex items-center justify-center"
                        >
                          <CheckCircle className="w-4 h-4 text-white" />
                        </motion.div>
                      </div>
                    )}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary to-[#A78BFA] flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                          {email.client_nom.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <p className="text-base font-medium text-foreground truncate">{email.client_nom}</p>
                          {email.interne ? <CodixBadge /> : null}
                          <LanguageBadge langue={email.langue} size="sm" />
                        </div>
                          <p className="text-xs text-muted-foreground">{formatDate(email.date_envoi)}</p>
                        </div>
                      </div>
                      <div className="flex-shrink-0 ml-2">{getSentimentIcon(email.sentiment)}</div>
                    </div>
                    <p className="text-base text-foreground mb-3 line-clamp-2 leading-snug">{email.sujet}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs px-2.5 py-1.5 rounded-lg border ${badge.color}`}>{badge.label}</span>
                      <span className="text-xs text-muted-foreground">Score de risque: {email.technicite || 0}%</span>
                      {hasValidAmount(email.montant) ? (
                        <span className="text-xs px-2.5 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20">
                          {formatCurrency(email.montant as number)}
                        </span>
                      ) : null}
                      {hasInvoiceReference(email.reference_facture) ? (
                        <span className="text-xs px-2.5 py-1.5 rounded-lg bg-secondary/10 text-secondary border border-secondary/20">
                          {email.reference_facture}
                        </span>
                      ) : null}
                      <span
                        className={`text-xs px-2.5 py-1.5 rounded-lg ${
                          email.priorite === "HAUTE"
                            ? "bg-destructive/10 text-destructive"
                            : email.priorite === "NORMALE"
                              ? "bg-[#F59E0B]/10 text-[#F59E0B]"
                              : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {email.priorite}
                      </span>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        {selectedEmail ? (
          <motion.div
            key={selectedEmail.email_id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex-1 bg-card rounded-2xl shadow-sm border border-border flex flex-col overflow-hidden max-w-full"
          >
            <div className="p-6 border-b border-border flex-shrink-0">
              <div className="flex items-start justify-between mb-5">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    {isEditing && draftEmail ? (
                      <input
                        value={draftEmail.sujet}
                        onChange={(event) => handleDraftChange("sujet", event.target.value)}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xl font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    ) : (
                      <h2 className="text-xl font-medium text-foreground leading-tight">{selectedEmail.sujet}</h2>
                    )}
                    <LanguageBadge langue={selectedEmail.langue} size="md" />
                  </div>
                  <div className="flex items-center gap-5 text-sm text-muted-foreground flex-wrap">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{selectedEmail.client_nom}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(selectedEmail.date_envoi)}</span>
                    </div>
                    <div className={`flex items-center gap-2 ${getHealthColor(selectedEmail.client_sante)}`}>
                      <AlertTriangle className="w-4 h-4" />
                      {selectedEmail.client_sante}
                    </div>
                    {selectedEmail.interne ? (
                      <div className="flex items-center gap-2 text-[#0EA5E9]">
                        <Building2 className="w-4 h-4" />
                        <span>Email interne Codix</span>
                        <CodixBadge />
                      </div>
                    ) : null}
                  </div>
                </div>
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className={`text-sm px-4 py-2 rounded-lg border flex-shrink-0 ${getRiskBadge(selectedEmail.technicite, selectedEmail.risque_impaye).color}`}
                >
                  {getRiskBadge(selectedEmail.technicite, selectedEmail.risque_impaye).label}
                </motion.span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain p-6 space-y-6">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <h3 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Contenu de l'email
                </h3>
                <div className="bg-muted rounded-xl p-6">
                  {isEditing && draftEmail ? (
                    <textarea
                      value={draftEmail.corps}
                      onChange={(event) => handleDraftChange("corps", event.target.value)}
                      rows={8}
                      className="w-full resize-none rounded-lg border border-border bg-background p-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  ) : (
                    <p className="text-sm text-foreground whitespace-pre-line leading-relaxed">{selectedEmail.corps}</p>
                  )}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <h3 className="text-sm font-medium text-foreground mb-4">Informations extraites</h3>
                <div className="grid grid-cols-3 gap-4">
                  {isEditing && draftEmail ? (
                    <motion.div whileHover={{ y: -2 }} className="bg-muted rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="w-4 h-4 text-primary" />
                        <span className="text-xs text-muted-foreground">Montant</span>
                      </div>
                      <input
                        type="number"
                        min="0"
                        value={draftEmail.montant ?? ""}
                        onChange={(event) =>
                          handleDraftChange("montant", event.target.value === "" ? null : Number(event.target.value))
                        }
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </motion.div>
                  ) : hasValidAmount(selectedEmail.montant) ? (
                    <motion.div whileHover={{ y: -2 }} className="bg-muted rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="w-4 h-4 text-primary" />
                        <span className="text-xs text-muted-foreground">Montant</span>
                      </div>
                      <p className="text-base text-foreground">{formatCurrency(selectedEmail.montant as number)}</p>
                    </motion.div>
                  ) : (
                    <motion.div whileHover={{ y: -2 }} className="bg-muted rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Montant</span>
                      </div>
                      <p className="text-base text-muted-foreground">Non detecte</p>
                    </motion.div>
                  )}
                  <motion.div whileHover={{ y: -2 }} className="bg-muted rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Hash className="w-4 h-4 text-secondary" />
                      <span className="text-xs text-muted-foreground">Reference facture</span>
                    </div>
                    {isEditing && draftEmail ? (
                      <input
                        value={draftEmail.reference_facture ?? ""}
                        onChange={(event) => handleDraftChange("reference_facture", event.target.value || null)}
                        placeholder="Ex: INV-2026-778"
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    ) : (
                      <p className={`text-base ${hasInvoiceReference(selectedEmail.reference_facture) ? "text-foreground" : "text-muted-foreground"}`}>
                        {hasInvoiceReference(selectedEmail.reference_facture) ? selectedEmail.reference_facture : "Non detectee"}
                      </p>
                    )}
                  </motion.div>
                  <motion.div whileHover={{ y: -2 }} className="bg-muted rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-[#10B981]" />
                      <span className="text-xs text-muted-foreground">Contexte client</span>
                    </div>
                    <p className="text-base text-foreground">
                      {selectedEmail.client_secteur} - {selectedEmail.client_pays}
                    </p>
                  </motion.div>
                </div>
                {!hasValidAmount(selectedEmail.montant) && !hasInvoiceReference(selectedEmail.reference_facture) ? (
                  <div className="mt-4 rounded-xl border border-dashed border-border bg-card px-4 py-3 text-sm text-muted-foreground">
                    Le modele n'a detecte ni montant ni reference facture dans cet email.
                  </div>
                ) : null}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-secondary/10 to-primary/10 rounded-xl p-6"
              >
                <h3 className="text-sm font-medium text-foreground mb-5">Score de risque</h3>
                <div className="space-y-5">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-foreground">Score de risque</span>
                      {isEditing && draftEmail ? (
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={draftEmail.technicite ?? 0}
                          onChange={(event) => handleDraftChange("technicite", Number(event.target.value))}
                          className="w-24 rounded-lg border border-border bg-background px-3 py-1.5 text-right text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      ) : (
                        <span className="text-base text-foreground">{selectedEmail.technicite || 0}%</span>
                      )}
                    </div>
                    <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${selectedEmail.technicite || 0}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className={`h-full rounded-full ${
                          getRiskBadge(selectedEmail.technicite, selectedEmail.risque_impaye).level === "aucun"
                            ? "bg-[#888780]"
                            : getRiskBadge(selectedEmail.technicite, selectedEmail.risque_impaye).level === "eleve"
                            ? "bg-destructive"
                            : getRiskBadge(selectedEmail.technicite, selectedEmail.risque_impaye).level === "moyen"
                              ? "bg-[#F59E0B]"
                              : "bg-primary"
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-foreground">Sentiment detecte:</span>
                      {getSentimentIcon(selectedEmail.sentiment)}
                      <span className="text-sm text-foreground capitalize">
                        {selectedEmail.sentiment === "positive"
                          ? "Positif"
                          : selectedEmail.sentiment === "negative"
                            ? "Negatif"
                            : "Neutre"}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border">
                    <p className="text-sm text-foreground">
                      <span>Priorite:</span>{" "}
                      {isEditing && draftEmail ? (
                        <select
                          value={draftEmail.priorite}
                          onChange={(event) => handleDraftChange("priorite", event.target.value)}
                          className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="HAUTE">HAUTE</option>
                          <option value="NORMALE">NORMALE</option>
                          <option value="BASSE">BASSE</option>
                        </select>
                      ) : (
                        <span
                          className={
                            selectedEmail.priorite === "HAUTE"
                              ? "text-destructive"
                              : selectedEmail.priorite === "NORMALE"
                                ? "text-[#F59E0B]"
                                : "text-muted-foreground"
                          }
                        >
                          {selectedEmail.priorite}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </motion.div>

            </div>

            <div className="p-6 border-t border-border flex items-center gap-4 flex-shrink-0 bg-card">
              {isEditing ? (
                <>
                  <motion.button
                    onClick={handleSaveEdit}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Enregistrer
                  </motion.button>
                  <motion.button
                    onClick={handleCancelEdit}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 bg-muted text-foreground rounded-xl hover:bg-muted/80 transition-colors flex items-center justify-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Annuler
                  </motion.button>
                </>
              ) : (
                <>
                  <motion.button
                    onClick={handleValidate}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Valider l'analyse
                  </motion.button>
                  <motion.button
                    onClick={handleSuggestReply}
                    disabled={isGeneratingReply}
                    whileHover={{ scale: isGeneratingReply ? 1 : 1.02 }}
                    whileTap={{ scale: isGeneratingReply ? 1 : 0.98 }}
                    className="px-6 py-3 bg-secondary text-white rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Sparkles className="w-4 h-4" />
                    {isGeneratingReply ? "Generation..." : "Suggérer réponse"}
                  </motion.button>
                  <motion.button
                    onClick={handleEdit}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 bg-muted text-foreground rounded-xl hover:bg-muted/80 transition-colors flex items-center justify-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Modifier
                  </motion.button>
                </>
              )}
            </div>
          </motion.div>
        ) : (
          <div className="flex-1 bg-card rounded-2xl shadow-sm border border-border flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <Mail className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Selectionnez un email</p>
              <p className="text-sm mt-2">Choisissez un email dans la liste pour voir les details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
