package fr.ecom.primheure.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import fr.ecom.primheure.domain.enumeration.Saison;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Produit.
 */
@Entity
@Table(name = "produit")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Produit implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "nom")
    private String nom;

    @Column(name = "vendable_unite")
    private Boolean vendableUnite;

    @Column(name = "prix", precision = 21, scale = 2)
    private BigDecimal prix;

    @Column(name = "quantite")
    private Integer quantite;

    @Column(name = "pas")
    private Integer pas;

    @Column(name = "description")
    private String description;

    @Column(name = "provenance")
    private String provenance;

    @Column(name = "image")
    private String image;

    @Enumerated(EnumType.STRING)
    @Column(name = "saison")
    private Saison saison;

    @Column(name = "numero_version")
    private Integer numeroVersion;

    @OneToMany(mappedBy = "produit")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "produit" }, allowSetters = true)
    private Set<Categorie> categories = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Produit id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return this.nom;
    }

    public Produit nom(String nom) {
        this.setNom(nom);
        return this;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public Boolean getVendableUnite() {
        return this.vendableUnite;
    }

    public Produit vendableUnite(Boolean vendableUnite) {
        this.setVendableUnite(vendableUnite);
        return this;
    }

    public void setVendableUnite(Boolean vendableUnite) {
        this.vendableUnite = vendableUnite;
    }

    public BigDecimal getPrix() {
        return this.prix;
    }

    public Produit prix(BigDecimal prix) {
        this.setPrix(prix);
        return this;
    }

    public void setPrix(BigDecimal prix) {
        this.prix = prix;
    }

    public Integer getQuantite() {
        return this.quantite;
    }

    public Produit quantite(Integer quantite) {
        this.setQuantite(quantite);
        return this;
    }

    public void setQuantite(Integer quantite) {
        this.quantite = quantite;
    }

    public Integer getPas() {
        return this.pas;
    }

    public Produit pas(Integer pas) {
        this.setPas(pas);
        return this;
    }

    public void setPas(Integer pas) {
        this.pas = pas;
    }

    public String getDescription() {
        return this.description;
    }

    public Produit description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getProvenance() {
        return this.provenance;
    }

    public Produit provenance(String provenance) {
        this.setProvenance(provenance);
        return this;
    }

    public void setProvenance(String provenance) {
        this.provenance = provenance;
    }

    public String getImage() {
        return this.image;
    }

    public Produit image(String image) {
        this.setImage(image);
        return this;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public Saison getSaison() {
        return this.saison;
    }

    public Produit saison(Saison saison) {
        this.setSaison(saison);
        return this;
    }

    public void setSaison(Saison saison) {
        this.saison = saison;
    }

    public Integer getNumeroVersion() {
        return this.numeroVersion;
    }

    public Produit numeroVersion(Integer numeroVersion) {
        this.setNumeroVersion(numeroVersion);
        return this;
    }

    public void setNumeroVersion(Integer numeroVersion) {
        this.numeroVersion = numeroVersion;
    }

    public Set<Categorie> getCategories() {
        return this.categories;
    }

    public void setCategories(Set<Categorie> categories) {
        if (this.categories != null) {
            this.categories.forEach(i -> i.setProduit(null));
        }
        if (categories != null) {
            categories.forEach(i -> i.setProduit(this));
        }
        this.categories = categories;
    }

    public Produit categories(Set<Categorie> categories) {
        this.setCategories(categories);
        return this;
    }

    public Produit addCategories(Categorie categorie) {
        this.categories.add(categorie);
        categorie.setProduit(this);
        return this;
    }

    public Produit removeCategories(Categorie categorie) {
        this.categories.remove(categorie);
        categorie.setProduit(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Produit)) {
            return false;
        }
        return id != null && id.equals(((Produit) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Produit{" +
            "id=" + getId() +
            ", nom='" + getNom() + "'" +
            ", vendableUnite='" + getVendableUnite() + "'" +
            ", prix=" + getPrix() +
            ", quantite=" + getQuantite() +
            ", pas=" + getPas() +
            ", description='" + getDescription() + "'" +
            ", provenance='" + getProvenance() + "'" +
            ", image='" + getImage() + "'" +
            ", saison='" + getSaison() + "'" +
            ", numeroVersion=" + getNumeroVersion() +
            "}";
    }
}
