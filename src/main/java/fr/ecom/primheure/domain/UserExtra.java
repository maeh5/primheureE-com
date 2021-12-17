package fr.ecom.primheure.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A UserExtra.
 */
@Entity
@Table(name = "user_extra")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class UserExtra implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column(name = "id")
    private Long id;

    @OneToOne
    @MapsId
    @JoinColumn(name = "id")
    private User user;

    @OneToMany(mappedBy = "userExtra", fetch = FetchType.EAGER) //TODO: voir pourquoi le lazy ne marche pas
    //@Cache(usage = CacheConcurrencyStrategy.READ_WRITE) TODO: gerer le cache
    @JsonIgnoreProperties(value = { "produits", "userExtra" }, allowSetters = true)
    private Set<Commande> histCommandes = new HashSet<>();

    @OneToMany(mappedBy = "userExtra", fetch = FetchType.EAGER)
    //@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "userExtra" }, allowSetters = true)
    private Set<Adresse> adresses = new HashSet<>();

    @OneToMany(mappedBy = "userExtra", fetch = FetchType.EAGER)
    //@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "userExtra" }, allowSetters = true)
    private Set<CarteBancaire> cartesBancaires = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public UserExtra id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public UserExtra user(User user) {
        this.setUser(user);
        return this;
    }

    public Set<Commande> getHistCommandes() {
        return this.histCommandes;
    }

    public void setHistCommandes(Set<Commande> commandes) {
        if (this.histCommandes != null) {
            this.histCommandes.forEach(i -> i.setUserExtra(null));
        }
        if (commandes != null) {
            commandes.forEach(i -> i.setUserExtra(this));
        }
        this.histCommandes = commandes;
    }

    public UserExtra histCommandes(Set<Commande> commandes) {
        this.setHistCommandes(commandes);
        return this;
    }

    public UserExtra addHistCommandes(Commande commande) {
        this.histCommandes.add(commande);
        commande.setUserExtra(this);
        return this;
    }

    public UserExtra removeHistCommandes(Commande commande) {
        this.histCommandes.remove(commande);
        commande.setUserExtra(null);
        return this;
    }

    public Set<Adresse> getAdresses() {
        return this.adresses;
    }

    public void setAdresses(Set<Adresse> adresses) {
        if (this.adresses != null) {
            this.adresses.forEach(i -> i.setUserExtra(null));
        }
        if (adresses != null) {
            adresses.forEach(i -> i.setUserExtra(this));
        }
        this.adresses = adresses;
    }

    public UserExtra adresses(Set<Adresse> adresses) {
        this.setAdresses(adresses);
        return this;
    }

    public UserExtra addAdresses(Adresse adresse) {
        this.adresses.add(adresse);
        adresse.setUserExtra(this);
        return this;
    }

    public UserExtra removeAdresses(Adresse adresse) {
        this.adresses.remove(adresse);
        adresse.setUserExtra(null);
        return this;
    }

    public Set<CarteBancaire> getCartesBancaires() {
        return this.cartesBancaires;
    }

    public void setCartesBancaires(Set<CarteBancaire> carteBancaires) {
        if (this.cartesBancaires != null) {
            this.cartesBancaires.forEach(i -> i.setUserExtra(null));
        }
        if (carteBancaires != null) {
            carteBancaires.forEach(i -> i.setUserExtra(this));
        }
        this.cartesBancaires = carteBancaires;
    }

    public UserExtra cartesBancaires(Set<CarteBancaire> carteBancaires) {
        this.setCartesBancaires(carteBancaires);
        return this;
    }

    public UserExtra addCartesBancaires(CarteBancaire carteBancaire) {
        this.cartesBancaires.add(carteBancaire);
        carteBancaire.setUserExtra(this);
        return this;
    }

    public UserExtra removeCartesBancaires(CarteBancaire carteBancaire) {
        this.cartesBancaires.remove(carteBancaire);
        carteBancaire.setUserExtra(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof UserExtra)) {
            return false;
        }
        return id != null && id.equals(((UserExtra) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "UserExtra{" +
            "id=" + getId() +
            "}";
    }
}
