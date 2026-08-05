const MentionsLegales = () => {
  const derniereMiseAJour = '5 août 2026';

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <article className="prose legal-prose max-w-none">
          <h1 className="text-2xl sm:text-4xl font-bold text-primary mb-3 sm:mb-4 text-center">Mentions Légales</h1>

          <h2>1. Informations sur l'entreprise</h2>
          <ul>
            <li><strong>Raison sociale :</strong> 2NB DIGITAL</li>
            <li><strong>Forme juridique :</strong> Société à Responsabilité Limitée (SARL)</li>
            <li><strong>Capital social :</strong> 1 000 000 FCFA</li>
            <li><strong>Siège social :</strong> 08 BP 885 OUAGA 08, Ouagadougou, Burkina Faso</li>
            <li><strong>RCCM :</strong> BF-OUA-01-2026-B12-12996</li>
            <li><strong>IFU :</strong> 00319189K</li>
            <li><strong>Email :</strong> contact@2nbdigital.com</li>
            <li><strong>Téléphone :</strong> +226 77 53 44 19</li>
            <li><strong>Site web :</strong> www.2nbdigital.com</li>
          </ul>

          <h2>2. Directeur de publication</h2>
          <p>
            Le directeur de la publication est le représentant légal de 2NB Digital, Monsieur Christian Thomas Badolo.
          </p>

          <h2>3. Hébergement</h2>
          <p>
            Ce site est hébergé par un prestataire technique. Pour toute information concernant l'hébergement,
            veuillez nous contacter à l'adresse indiquée ci-dessus.
          </p>

          <h2>4. Propriété intellectuelle</h2>
          <p>
            L'ensemble de ce site relève de la législation burkinabè et internationale sur le droit d'auteur
            et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les
            documents téléchargeables et les représentations iconographiques et photographiques.
          </p>
          <p>
            La reproduction de tout ou partie de ce site sur un support électronique quel qu'il soit est
            formellement interdite sauf autorisation expresse du directeur de la publication.
          </p>

          <h2>5. Protection des données personnelles</h2>
          <p>
            Conformément à la loi relative à la protection des données personnelles, vous disposez d'un droit
            d'accès, de rectification et de suppression des données vous concernant. Pour exercer ce droit,
            vous pouvez nous contacter à l'adresse : contact@2nbdigital.com.
          </p>

          <h2>6. Responsabilité</h2>
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

          <h2>7. Liens hypertextes</h2>
          <p>
            La mise en place d'un lien hypertexte vers le site www.2nbdigital.com nécessite une autorisation
            préalable écrite de 2NB Digital. 2NB Digital n'est pas responsable du contenu des sites vers
            lesquels des liens sont établis.
          </p>

          <h2>8. Droit applicable</h2>
          <p>
            Les présentes mentions légales sont régies par le droit burkinabè. Tout litige relatif à
            l'utilisation du site www.2nbdigital.com est de la compétence exclusive des tribunaux du Burkina Faso.
          </p>

          <hr />

          <p>Dernière mise à jour : {derniereMiseAJour}</p>
        </article>
      </div>
    </div>
  );
};

export default MentionsLegales;

