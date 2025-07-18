import { motion } from "framer-motion";
import { useState } from "react";
import styles from "./BalanceCard.module.css";
import { useApi } from "../../../hook/useApi";
import SkeletonBalance from "./SkeletonBalance";
import { 
  
  FiCreditCard, 
  FiDollarSign,
  FiPieChart,
  FiCalendar,
  FiAward,
  FiArrowUp,
  FiArrowDown
} from "react-icons/fi";

const BalanceCard = () => {
  const { data, loading, error } = useApi("user");
  const [activeView, setActiveView] = useState("savings"); // Ouvert par défaut

  if (loading) return <SkeletonBalance />;
  if (error) return <SkeletonBalance />;

  const { balance, totalSaved, totalgained, gainfuture, transactions } = data;

  // Formatage des données
  const formatCurrency = (value) => value?.toLocaleString() ?? "0";
  const formattedBalance = formatCurrency(balance);
  const formattedSaved = formatCurrency(totalSaved);
  const formattedGained = formatCurrency(totalgained);
  const formattedFuture = formatCurrency(gainfuture);

  const lastTransaction = transactions?.[0];
  const transactionDate = lastTransaction?.date 
    ? new Date(lastTransaction.date).toLocaleDateString('fr-FR', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      })
    : "--/--/----";

  // Données pour le graphique
  const savingsData = [
    { name: 'Perçu', value: totalgained, color: '#10B981' }, // Vert émeraude
    { name: 'Futur', value: gainfuture, color: '#3B82F6' }   // Bleu vif
  ];

  return (
    <div className={styles.container}>
      {/* Carte Principale - Solde Actuel */}
      <motion.div
        className={styles.mainCard}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, type: "spring" }}
        whileHover={{ y: -5 }}
      >
        <div className={styles.cardGradient} />
        <div className={styles.cardHeader}>
          <div className={styles.cardIconContainer}>
            <FiCreditCard className={styles.cardIcon} />
          </div>
          <div>
            <h2>Solde Actuel</h2>
            <p className={styles.cardSubtitle}>Disponible immédiatement</p>
          </div>
        </div>
        
        <div className={styles.balanceDisplay}>
          <motion.span 
            key={balance}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className={styles.balanceAmount}
          >
            {formattedBalance} <span className={styles.currency}>FCFA</span>
          </motion.span>
        </div>
        
        <div className={styles.cardFooter}>
          <motion.div
            className={styles.providerBadge}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <span>MoneyRound</span>
            <div className={styles.providerLogo}>MR</div>
          </motion.div>
        </div>
      </motion.div>

      {/* Section Épargne Totale */}
      <motion.div 
        className={styles.compactSavings}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div 
          className={styles.savingsHeader} 
          onClick={() => setActiveView(activeView === 'savings' ? 'overview' : 'savings')}
        >
          <div className={styles.headerTitle}>
            <FiPieChart className={styles.headerIcon} />
            <h3>Votre Épargne Totale</h3>
          </div>
          <motion.div 
            animate={{ rotate: activeView === 'savings' ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            
          </motion.div>
        </div>
        
        <div className={styles.savingsOverview}>
          <div className={styles.totalSaved}>
            <div className={styles.savingsLabel}>
              <FiDollarSign className={styles.labelIcon} />
              <span>Total Épargné</span>
            </div>
            <motion.span 
              className={styles.savingsValue}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {formattedSaved} FCFA
            </motion.span>
          </div>
          
          <div className={styles.savingsVisualization}>
            {/* Graphique circulaire animé */}
            <div className={styles.radialChart}>
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" className={styles.radialBackground} />
                {savingsData.map((item, index) => {
                  const percentage = (item.value / totalSaved) * 100;
                  const angle = (percentage / 100) * 360;
                  const previousPercentages = savingsData
                    .slice(0, index)
                    .reduce((sum, i) => sum + (i.value / totalSaved) * 360, 0);
                  
                  return (
                    <motion.circle
                      key={item.name}
                      cx="60"
                      cy="60"
                      r="50"
                      fill="transparent"
                      stroke={item.color}
                      strokeWidth="10"
                      strokeDasharray={`${angle} 360`}
                      strokeDashoffset={-previousPercentages}
                      transform="rotate(-90 60 60)"
                      strokeLinecap="round"
                      initial={{ strokeDasharray: "0 360", strokeDashoffset: 0 }}
                      animate={{ 
                        strokeDasharray: `${angle} 360`, 
                        strokeDashoffset: -previousPercentages 
                      }}
                      transition={{ 
                        duration: 1.5, 
                        delay: index * 0.3,
                        type: "spring",
                        damping: 10
                      }}
                    />
                  );
                })}
                <circle cx="60" cy="60" r="35" className={styles.radialCenter} />
                <text 
                  x="60" 
                  y="60" 
                  textAnchor="middle" 
                  dominantBaseline="middle"
                  className={styles.radialText}
                >
                  {Math.round((totalgained / totalSaved) * 100)}%
                </text>
                <text 
                  x="60" 
                  y="80" 
                  textAnchor="middle" 
                  className={styles.radialSubtext}
                >
                  Perçu
                </text>
              </svg>
            </div>
            
            <div className={styles.savingsBreakdown}>
              {savingsData.map((item) => (
                <motion.div 
                  key={item.name}
                  className={styles.breakdownItem}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + (item.name === 'Futur' ? 0.1 : 0) }}
                >
                  <div 
                    className={styles.breakdownDot} 
                    style={{ backgroundColor: item.color }} 
                  />
                  <div>
                    <div className={styles.breakdownLabel}>{item.name}</div>
                    <div className={styles.breakdownValue}>
                      {item.name === 'Perçu' ? formattedGained : formattedFuture} FCFA
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Détails expandables (toujours visible maintenant) */}
        <motion.div
          className={styles.savingsDetails}
          initial={{ opacity: 0, height: 0 }}
          animate={{ 
            opacity: 1, 
            height: 'auto',
            transition: { duration: 0.5 }
          }}
        >
          <div className={styles.detailCard}>
            <h4>
              <FiAward className={styles.detailIcon} />
              Historique des gains
            </h4>
            <div className={styles.detailProgress}>
              <div className={styles.progressTrack}>
                <motion.div 
                  className={styles.progressBar}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 1.5, type: "spring" }}
                  style={{ 
                    width: `${(totalgained / totalSaved) * 100}%`,
                    background: `linear-gradient(90deg, ${savingsData[0].color}, ${savingsData[1].color})`
                  }}
                />
              </div>
              <div className={styles.progressLabel}>
                <span>
                  <FiArrowUp className={styles.progressIcon} />
                  Réalisé: {Math.round((totalgained / totalSaved) * 100)}%
                </span>
                <span>
                  <FiArrowDown className={styles.progressIcon} />
                  Restant: {Math.round((gainfuture / totalSaved) * 100)}%
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Dernière Transaction */}
      <motion.div
        className={styles.transactionCard}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        whileHover={{ y: -3 }}
      >
        <div className={styles.transactionHeader}>
          <div className={styles.headerTitle}>
            <FiCalendar className={styles.headerIcon} />
            <h3>Dernière Opération</h3>
          </div>
          <span className={styles.transactionDate}>{transactionDate}</span>
        </div>
        
        <div className={styles.transactionContent}>
          <div className={styles.transactionIcon}>
            {lastTransaction?.type === 'deposit' ? (
              <FiArrowUp className={styles.transactionArrow} />
            ) : (
              <FiArrowDown className={styles.transactionArrow} />
            )}
          </div>
          
          <div className={styles.transactionInfo}>
            <motion.div 
              className={styles.transactionAmount}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{
                color: lastTransaction?.type === 'deposit' ? '#10B981' : '#EF4444'
              }}
            >
              {lastTransaction?.type === 'deposit' ? '+' : '-'}{lastTransaction?.amount.toLocaleString() ?? "0"} FCFA
            </motion.div>
            <div className={styles.transactionType}>
              {lastTransaction?.type === 'deposit' ? 'Dépôt' : 'Retrait'}
              {lastTransaction?.tontineId && (
                <span className={styles.tontineTag}>
                  Tontine #{lastTransaction.tontineId}
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BalanceCard;