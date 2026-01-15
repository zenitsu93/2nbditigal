import { Card } from 'flowbite-react';

const CGV = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-dark mb-8 text-center">Conditions Générales de Vente</h1>
        
        <Card className="mb-6">
          <h2 className="text-2xl font-semibold text-dark mb-4">1. Objet</h2>
          <p className="text-dark/70">
            Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre 
            2NB Digital, société de services numériques, et ses clients pour la fourniture de services de 
            développement web, mobile, conseil en transformation digitale, data science et intelligence 
            artificielle.
          </p>
        </Card>

        <Card className="mb-6">
          <h2 className="text-2xl font-semibold text-dark mb-4">2. Acceptation des conditions</h2>
          <p className="text-dark/70">
            Toute commande ou acceptation d'un devis implique l'acceptation sans réserve des présentes CGV 
            par le client. Toute condition contraire proposée par le client ne pourra être opposée à 2NB Digital 
            sauf accord exprès et écrit de notre part.
          </p>
        </Card>

        <Card className="mb-6">
          <h2 className="text-2xl font-semibold text-dark mb-4">3. Devis et commande</h2>
          <div className="space-y-3 text-dark/70">
            <p>
              <strong className="text-dark">3.1 Devis :</strong> Tout devis établi par 2NB Digital est valable 
              pendant un délai de 30 jours à compter de sa date d'émission, sauf mention contraire.
            </p>
            <p>
              <strong className="text-dark">3.2 Commande :</strong> La commande devient ferme et définitive 
              après acceptation écrite du devis par le client et réception d'un acompte éventuel.
            </p>
            <p>
              <strong className="text-dark">3.3 Modifications :</strong> Toute modification de la commande 
              après acceptation pourra entraîner une révision du prix et des délais, soumise à l'accord des deux parties.
            </p>
          </div>
        </Card>

        <Card className="mb-6">
          <h2 className="text-2xl font-semibold text-dark mb-4">4. Prix</h2>
          <div className="space-y-3 text-dark/70">
            <p>
              <strong className="text-dark">4.1 Prix :</strong> Les prix sont indiqués en francs CFA (FCFA) 
              ou en euros (€) selon le devis, hors taxes sauf mention contraire. Les prix sont fermes et 
              non révisables pendant la durée de validité du devis.
            </p>
            <p>
              <strong className="text-dark">4.2 Taxes :</strong> Les prix sont hors taxes. La TVA applicable 
              sera ajoutée conformément à la législation burkinabè en vigueur.
            </p>
            <p>
              <strong className="text-dark">4.3 Frais supplémentaires :</strong> Toute prestation non 
              prévue au devis initial fera l'objet d'un avenant et d'une facturation complémentaire.
            </p>
          </div>
        </Card>

        <Card className="mb-6">
          <h2 className="text-2xl font-semibold text-dark mb-4">5. Modalités de paiement</h2>
          <div className="space-y-3 text-dark/70">
            <p>
              <strong className="text-dark">5.1 Acompte :</strong> Un acompte de 30% à 50% du montant total 
              peut être demandé à la commande, sauf accord contraire.
            </p>
            <p>
              <strong className="text-dark">5.2 Solde :</strong> Le solde est exigible à la livraison ou 
              selon les échéances convenues dans le devis.
            </p>
            <p>
              <strong className="text-dark">5.3 Retard de paiement :</strong> Tout retard de paiement 
              entraîne de plein droit l'application d'intérêts de retard au taux de 3 fois le taux légal 
              en vigueur, ainsi qu'une indemnité forfaitaire pour frais de recouvrement de 40 000 FCFA.
            </p>
            <p>
              <strong className="text-dark">5.4 Moyens de paiement :</strong> Virement bancaire, chèque, 
              espèces (selon les montants), ou autres moyens convenus.
            </p>
          </div>
        </Card>

        <Card className="mb-6">
          <h2 className="text-2xl font-semibold text-dark mb-4">6. Délais de réalisation</h2>
          <div className="space-y-3 text-dark/70">
            <p>
              Les délais de réalisation indiqués dans le devis sont donnés à titre indicatif et ne sont 
              pas garantis. Ils courent à compter de la réception de l'acompte et de tous les éléments 
              nécessaires à la réalisation de la prestation.
            </p>
            <p>
              En cas de retard imputable au client (retard dans la fourniture d'informations, validation, 
              etc.), les délais seront prolongés d'autant. 2NB Digital ne saurait être tenu responsable 
              d'un retard dû à un cas de force majeure.
            </p>
          </div>
        </Card>

        <Card className="mb-6">
          <h2 className="text-2xl font-semibold text-dark mb-4">7. Obligations du client</h2>
          <div className="space-y-3 text-dark/70">
            <p>Le client s'engage à :</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Fournir toutes les informations et documents nécessaires à la réalisation de la prestation</li>
              <li>Valider les différentes étapes dans les délais convenus</li>
              <li>Effectuer les paiements aux échéances convenues</li>
              <li>Respecter les droits de propriété intellectuelle de 2NB Digital</li>
              <li>Ne pas utiliser les livrables à des fins illégales ou contraires aux bonnes mœurs</li>
            </ul>
          </div>
        </Card>

        <Card className="mb-6">
          <h2 className="text-2xl font-semibold text-dark mb-4">8. Propriété intellectuelle</h2>
          <div className="space-y-3 text-dark/70">
            <p>
              <strong className="text-dark">8.1 Droits de 2NB Digital :</strong> Tous les éléments 
              créés par 2NB Digital (code source, design, architecture, etc.) restent la propriété 
              intellectuelle de 2NB Digital jusqu'au paiement intégral de la facture.
            </p>
            <p>
              <strong className="text-dark">8.2 Cession :</strong> Après paiement intégral, les droits 
              d'exploitation sont cédés au client dans les limites définies dans le devis. Les droits 
              moraux restent la propriété de 2NB Digital.
            </p>
            <p>
              <strong className="text-dark">8.3 Réutilisation :</strong> 2NB Digital se réserve le droit 
              de réutiliser les connaissances et compétences acquises, ainsi que les éléments génériques 
              non spécifiques au client.
            </p>
          </div>
        </Card>

        <Card className="mb-6">
          <h2 className="text-2xl font-semibold text-dark mb-4">9. Garanties</h2>
          <div className="space-y-3 text-dark/70">
            <p>
              <strong className="text-dark">9.1 Garantie de conformité :</strong> 2NB Digital garantit 
              que les prestations seront réalisées conformément aux spécifications du devis accepté.
            </p>
            <p>
              <strong className="text-dark">9.2 Garantie de bon fonctionnement :</strong> Une garantie 
              de 3 mois est accordée sur les prestations de développement, à compter de la livraison, 
              pour les défauts de fonctionnement imputables à 2NB Digital.
            </p>
            <p>
              <strong className="text-dark">9.3 Exclusions :</strong> La garantie ne couvre pas les 
              modifications demandées par le client, les problèmes liés à l'environnement technique du 
              client, ou les cas de force majeure.
            </p>
          </div>
        </Card>

        <Card className="mb-6">
          <h2 className="text-2xl font-semibold text-dark mb-4">10. Responsabilité</h2>
          <div className="space-y-3 text-dark/70">
            <p>
              La responsabilité de 2NB Digital est limitée au montant des sommes perçues au titre de 
              la prestation en cause. 2NB Digital ne saurait être tenu responsable des dommages indirects 
              (perte de données, perte d'exploitation, préjudice commercial, etc.).
            </p>
            <p>
              Le client est seul responsable du contenu qu'il fournit et de son utilisation des livrables. 
              Il garantit 2NB Digital contre toute réclamation relative à ce contenu.
            </p>
          </div>
        </Card>

        <Card className="mb-6">
          <h2 className="text-2xl font-semibold text-dark mb-4">11. Résiliation</h2>
          <div className="space-y-3 text-dark/70">
            <p>
              En cas de manquement grave de l'une des parties à ses obligations, l'autre partie peut 
              résilier le contrat après mise en demeure restée sans effet pendant 15 jours.
            </p>
            <p>
              En cas de résiliation à l'initiative du client, les prestations déjà réalisées seront 
              facturées au prorata, et l'acompte versé ne sera pas remboursé.
            </p>
          </div>
        </Card>

        <Card className="mb-6">
          <h2 className="text-2xl font-semibold text-dark mb-4">12. Confidentialité</h2>
          <p className="text-dark/70">
            Chaque partie s'engage à maintenir la confidentialité de toutes les informations échangées 
            dans le cadre de la prestation et à ne pas les divulguer à des tiers sans autorisation écrite.
          </p>
        </Card>

        <Card className="mb-6">
          <h2 className="text-2xl font-semibold text-dark mb-4">13. Droit applicable et juridiction</h2>
          <p className="text-dark/70">
            Les présentes CGV sont régies par le droit burkinabè. Tout litige relatif à leur interprétation 
            ou à leur exécution relève de la compétence exclusive des tribunaux du Burkina Faso.
          </p>
        </Card>

        <Card>
          <h2 className="text-2xl font-semibold text-dark mb-4">14. Contact</h2>
          <div className="space-y-2 text-dark/70">
            <p>Pour toute question concernant ces CGV :</p>
            <p><strong className="text-dark">2NB Digital</strong></p>
            <p><strong className="text-dark">Email :</strong> contact@2nbdigital.com</p>
            <p><strong className="text-dark">Téléphone :</strong> +226 77 53 44 19</p>
            <p><strong className="text-dark">Adresse :</strong> Burkina Faso</p>
          </div>
        </Card>

        <div className="mt-8 text-center text-dark/70">
          <p>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>
    </div>
  );
};

export default CGV;

