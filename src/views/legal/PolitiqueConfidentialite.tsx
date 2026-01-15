import { Card } from 'flowbite-react';

const PolitiqueConfidentialite = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-dark mb-8 text-center">Politique de Confidentialité</h1>
        
        <Card className="mb-6">
          <h2 className="text-2xl font-semibold text-dark mb-4">1. Introduction</h2>
          <p className="text-dark/70">
            2NB Digital s'engage à protéger la confidentialité et la sécurité des informations personnelles 
            que vous nous confiez. Cette politique de confidentialité explique comment nous collectons, 
            utilisons, stockons et protégeons vos données personnelles conformément à la législation 
            burkinabè en vigueur.
          </p>
        </Card>

        <Card className="mb-6">
          <h2 className="text-2xl font-semibold text-dark mb-4">2. Données collectées</h2>
          <div className="space-y-3 text-dark/70">
            <p><strong className="text-dark">Nous collectons les informations suivantes :</strong></p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Nom et prénom</li>
              <li>Adresse email</li>
              <li>Numéro de téléphone</li>
              <li>Nom de l'entreprise (si applicable)</li>
              <li>Informations relatives à votre demande ou projet</li>
              <li>Données de navigation (cookies, adresse IP)</li>
            </ul>
          </div>
        </Card>

        <Card className="mb-6">
          <h2 className="text-2xl font-semibold text-dark mb-4">3. Utilisation des données</h2>
          <div className="space-y-3 text-dark/70">
            <p>Vos données personnelles sont utilisées pour :</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Répondre à vos demandes de contact et de devis</li>
              <li>Vous fournir nos services et solutions digitales</li>
              <li>Améliorer notre site web et nos services</li>
              <li>Vous envoyer des communications relatives à nos services (avec votre consentement)</li>
              <li>Respecter nos obligations légales et réglementaires</li>
            </ul>
          </div>
        </Card>

        <Card className="mb-6">
          <h2 className="text-2xl font-semibold text-dark mb-4">4. Base légale du traitement</h2>
          <div className="space-y-3 text-dark/70">
            <p>Le traitement de vos données personnelles est basé sur :</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Votre consentement explicite</li>
              <li>L'exécution d'un contrat ou de mesures précontractuelles</li>
              <li>Le respect d'obligations légales</li>
              <li>Nos intérêts légitimes (amélioration de nos services)</li>
            </ul>
          </div>
        </Card>

        <Card className="mb-6">
          <h2 className="text-2xl font-semibold text-dark mb-4">5. Conservation des données</h2>
          <p className="text-dark/70">
            Nous conservons vos données personnelles uniquement pendant la durée nécessaire aux finalités 
            pour lesquelles elles ont été collectées, ou conformément aux obligations légales applicables. 
            Les données de contact sont conservées pendant 3 ans à compter du dernier contact, sauf 
            opposition de votre part.
          </p>
        </Card>

        <Card className="mb-6">
          <h2 className="text-2xl font-semibold text-dark mb-4">6. Partage des données</h2>
          <div className="space-y-3 text-dark/70">
            <p>
              Nous ne vendons, ne louons ni ne partageons vos données personnelles à des tiers, sauf dans 
              les cas suivants :
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Avec votre consentement explicite</li>
              <li>Pour répondre à une obligation légale ou judiciaire</li>
              <li>Avec nos prestataires de services (hébergement, outils de communication) sous contrat de confidentialité</li>
            </ul>
          </div>
        </Card>

        <Card className="mb-6">
          <h2 className="text-2xl font-semibold text-dark mb-4">7. Sécurité des données</h2>
          <p className="text-dark/70">
            Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger 
            vos données personnelles contre tout accès non autorisé, perte, destruction ou altération. 
            Cependant, aucune méthode de transmission sur Internet n'est totalement sécurisée.
          </p>
        </Card>

        <Card className="mb-6">
          <h2 className="text-2xl font-semibold text-dark mb-4">8. Vos droits</h2>
          <div className="space-y-3 text-dark/70">
            <p>Conformément à la législation en vigueur, vous disposez des droits suivants :</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong className="text-dark">Droit d'accès :</strong> Vous pouvez demander une copie de vos données personnelles</li>
              <li><strong className="text-dark">Droit de rectification :</strong> Vous pouvez corriger vos données inexactes</li>
              <li><strong className="text-dark">Droit à l'effacement :</strong> Vous pouvez demander la suppression de vos données</li>
              <li><strong className="text-dark">Droit d'opposition :</strong> Vous pouvez vous opposer au traitement de vos données</li>
              <li><strong className="text-dark">Droit à la portabilité :</strong> Vous pouvez récupérer vos données dans un format structuré</li>
              <li><strong className="text-dark">Droit de retrait du consentement :</strong> Vous pouvez retirer votre consentement à tout moment</li>
            </ul>
            <p className="mt-4">
              Pour exercer ces droits, contactez-nous à : <strong className="text-dark">contact@2nbdigital.com</strong>
            </p>
          </div>
        </Card>

        <Card className="mb-6">
          <h2 className="text-2xl font-semibold text-dark mb-4">9. Cookies</h2>
          <div className="space-y-3 text-dark/70">
            <p>
              Notre site utilise des cookies pour améliorer votre expérience de navigation. Les cookies 
              sont de petits fichiers texte stockés sur votre appareil. Vous pouvez configurer votre 
              navigateur pour refuser les cookies, mais cela peut affecter certaines fonctionnalités du site.
            </p>
            <p>
              Types de cookies utilisés :
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Cookies essentiels : nécessaires au fonctionnement du site</li>
              <li>Cookies analytiques : pour comprendre l'utilisation du site</li>
              <li>Cookies de préférences : pour mémoriser vos choix</li>
            </ul>
          </div>
        </Card>

        <Card className="mb-6">
          <h2 className="text-2xl font-semibold text-dark mb-4">10. Modifications</h2>
          <p className="text-dark/70">
            Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. 
            Les modifications seront publiées sur cette page avec une date de mise à jour. Nous vous 
            encourageons à consulter régulièrement cette page.
          </p>
        </Card>

        <Card>
          <h2 className="text-2xl font-semibold text-dark mb-4">11. Contact</h2>
          <div className="space-y-2 text-dark/70">
            <p>Pour toute question concernant cette politique de confidentialité :</p>
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

export default PolitiqueConfidentialite;

