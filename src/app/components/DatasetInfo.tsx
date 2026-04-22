import { motion } from 'motion/react';
import { Database, Calendar, TrendingUp } from 'lucide-react';
import { datasetMetadata } from '../data/mockData';

export function DatasetInfo() {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-4 mb-6 border border-border"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Dataset Codix</p>
              <p className="text-sm font-semibold text-foreground">
                {datasetMetadata.total_emails.toLocaleString('fr-FR')} emails
              </p>
            </div>
          </div>

          <div className="h-8 w-px bg-border" />

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-secondary" />
            <div>
              <p className="text-xs text-muted-foreground">Dernière mise à jour</p>
              <p className="text-sm font-semibold text-foreground">
                {formatDate(datasetMetadata.derniere_mise_a_jour)}
              </p>
            </div>
          </div>

          <div className="h-8 w-px bg-border" />

          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Précision du modèle</p>
              <p className="text-sm font-semibold text-foreground">
                {datasetMetadata.modele_accuracy}% ({datasetMetadata.modele_version})
              </p>
            </div>
          </div>
        </div>

        <div className="text-right">
          <p className="text-xs text-muted-foreground">Période d'analyse</p>
          <p className="text-sm font-medium text-foreground">{datasetMetadata.periode_analyse}</p>
        </div>
      </div>
    </motion.div>
  );
}
