package fr.ecom.primheure.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import fr.ecom.primheure.domain.enumeration.EtatCommande;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Commande.
 */
@Entity
@Table(name = "commande")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Commande implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "etat")
    private EtatCommande etat;

    @Column(name = "prix_total", precision = 21, scale = 2)
    private BigDecimal prixTotal;

    @Column(name = "date_achat")
    private LocalDate dateAchat;

    @OneToMany(mappedBy = "commande")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "produit", "commande" }, allowSetters = true)
    private Set<DetailProduitCommande> produits = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "user", "histCommandes", "adresses", "cartesBancaires" }, allowSetters = true)
    private UserExtra userExtra;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Commande id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public EtatCommande getEtat() {
        return this.etat;
    }

    public Commande etat(EtatCommande etat) {
        this.setEtat(etat);
        return this;
    }

    public void setEtat(EtatCommande etat) {
        this.etat = etat;
    }

    public BigDecimal getPrixTotal() {
        return this.prixTotal;
    }

    public Commande prixTotal(BigDecimal prixTotal) {
        this.setPrixTotal(prixTotal);
        return this;
    }

    public void setPrixTotal(BigDecimal prixTotal) {
        this.prixTotal = prixTotal;
    }

    public LocalDate getDateAchat() {
        return this.dateAchat;
    }

    public Commande dateAchat(LocalDate dateAchat) {
        this.setDateAchat(dateAchat);
        return this;
    }

    public void setDateAchat(LocalDate dateAchat) {
        this.dateAchat = dateAchat;
    }

    public Set<DetailProduitCommande> getProduits() {
        return this.produits;
    }

    public void setProduits(Set<DetailProduitCommande> detailProduitCommandes) {
        if (this.produits != null) {
            this.produits.forEach(i -> i.setCommande(null));
        }
        if (detailProduitCommandes != null) {
            detailProduitCommandes.forEach(i -> i.setCommande(this));
        }
        this.produits = detailProduitCommandes;
    }

    public Commande produits(Set<DetailProduitCommande> detailProduitCommandes) {
        this.setProduits(detailProduitCommandes);
        return this;
    }

    public Commande addProduits(DetailProduitCommande detailProduitCommande) {
        this.produits.add(detailProduitCommande);
        detailProduitCommande.setCommande(this);
        return this;
    }

    public Commande removeProduits(DetailProduitCommande detailProduitCommande) {
        this.produits.remove(detailProduitCommande);
        detailProduitCommande.setCommande(null);
        return this;
    }

    public UserExtra getUserExtra() {
        return this.userExtra;
    }

    public void setUserExtra(UserExtra userExtra) {
        this.userExtra = userExtra;
    }

    public Commande userExtra(UserExtra userExtra) {
        this.setUserExtra(userExtra);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Commande)) {
            return false;
        }
        return id != null && id.equals(((Commande) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Commande{" +
            "id=" + getId() +
            ", etat='" + getEtat() + "'" +
            ", prixTotal=" + getPrixTotal() +
            ", dateAchat='" + getDateAchat() + "'" +
            "}";
    }
}
