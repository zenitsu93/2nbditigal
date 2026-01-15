import { Card } from 'flowbite-react';

const MentionsLegales = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-dark mb-8 text-center">Mentions Légales</h1>
        
        <Card className="mb-6">
          <h2 className="text-2xl font-semibold text-dark mb-4">1. Informations sur l'entreprise</h2>
          <div className="space-y-3 text-dark/70">
            <p><strong className="text-dark">Raison sociale :</strong> 2NB Digital</p>
            <p><strong className="text-dark">Forme juridique :</strong> Société</p>
            <p><strong className="text-dark">Siège social :</strong> Burkina Faso</p>
            <p><strong className="text-dark">Email :</strong> contact@2nbdigital.com</p>
            <p><strong className="text-dark">Téléphone :</strong> +226 77 53 44 19</p>
            <p><strong className="text-dark">Site web :</strong> www.2nbdigital.com</p>
          </div>
        </Card>

        <Card className="mb-6">
          <h2 className="text-2xl font-semibold text-dark mb-4">2. Directeur de publication</h2>
          <p className="text-dark/70">
            Le directeur de la publication est le représentant légal de 2NB Digital.
          </p>
        </Card>

        <Card className="mb-6">
          <h2 className="text-2xl font-semibold text-dark mb-4">3. Hébergement</h2>
          <p className="text-dark/70">
            Ce site est hébergé par un prestataire technique. Pour toute information concernant l'hébergement, 
            veuillez nous contacter à l'adresse indiquée ci-dessus.
          </p>
        </Card>

        <Card className="mb-6">
          <h2 className="text-2xl font-semibold text-dark mb-4">4. Propriété intellectuelle</h2>
          <div className="space-y-3 text-dark/70">
            <p>
              L'ensemble de ce site relève de la législation burkinabè et internationale sur le droit d'auteur 
              et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les 
              documents téléchargeables et les représentations iconographiques et photographiques.
            </p>
            <p>
              La reproduction de tout ou partie de ce site sur un support électronique quel qu'il soit est 
              formellement interdite sauf autorisation expresse du directeur de la publication.
            </p>
          </div>
        </Card>

        <Card className="mb-6">
          <h2 className="text-2xl font-semibold text-dark mb-4">5. Protection des données personnelles</h2>
          <p className="text-dark/70">
            Conformément à la loi relative à la protection des données personnelles, vous disposez d'un droit 
            d'accès, de rectification et de suppression des données vous concernant. Pour exercer ce droit, 
            vous pouvez nous contacter à l'adresse : contact@2nbdigital.com
          </p>
        </Card>

        <Card className="mb-6">
          <h2 className="text-2xl font-semibold text-dark mb-4">6. Responsabilité</h2>
          <div className="space-y-3 text-dark/70">
            <p>
              2NB Digital s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur 
              ce site, dont elle se réserve le droit de corriger, à tout moment et sans préavis, le contenu.
            </p>
            <p>
              Toutefois, 2NB Digital ne peut garantir l'exactitude, la précision ou l'exhaustivité des 
              informations mises à disposition sur ce site. En conséquence, 2NB Digital décline toute 
              responsabilité pour tout dommage résultant d'une intrusion d'un tiers ayant entraîné une 
              modification des informations mises à disposition sur le site.
            </p>
          </div>
        </Card>

        <Card className="mb-6">
          <h2 className="text-2xl font-semibold text-dark mb-4">7. Liens hypertextes</h2>
          <p className="text-dark/70">
            La mise en place d'un lien hypertexte vers le site www.2nbdigital.com nécessite une autorisation 
            préalable écrite de 2NB Digital. 2NB Digital n'est pas responsable du contenu des sites vers 
            lesquels des liens sont établis.
          </p>
        </Card>

        <Card>
          <h2 className="text-2xl font-semibold text-dark mb-4">8. Droit applicable</h2>
          <p className="text-dark/70">
            Les présentes mentions légales sont régies par le droit burkinabè. Tout litige relatif à 
            l'utilisation du site www.2nbdigital.com est de la compétence exclusive des tribunaux du Burkina Faso.
          </p>
        </Card>

        <div className="mt-8 text-center text-dark/70">
          <p>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>
    </div>
  );
};

export default MentionsLegales;

