import { FaUser, FaIdBadge, FaCalendarAlt, FaLayerGroup, FaCogs } from 'react-icons/fa';
import React, { useState, useRef, useEffect } from "react";
import { FiMoreVertical } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./Gestion-Utilisateurs.css";
import Ynov from '../img/Ynov.png';
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../convex/_generated/api";
import DashboardLayout from './DashboardLayout';

const GestionUtilisateurs = () => {
  // Ajout des filtres pour prénom et année
  const [filterPrenom, setFilterPrenom] = useState("");
  const [filterAnnee, setFilterAnnee] = useState("");
  const navigate = useNavigate();
  const usersFromDb = useQuery(api.auth.listUsers) || [];
  const users = usersFromDb.map((u) => ({
    _id: u._id,
    nom: u.lastName || "",
    prenom: u.firstName || "",
    email: u.email || "",
    role: u.role || "",
    promotion: u.promotion || "",
    specialite: u.specialite || "",
    photoUrl: u.photoUrl || "/la-personne.png",
    isActive: typeof u.isActive === 'boolean' ? u.isActive : true,
    isOnline: typeof u.isOnline === 'boolean' ? u.isOnline : false,
  }));

  const adminInsertUser = useAction(api.authActions.adminInsertUser);
  const updateUserMutation = useMutation(api.auth.updateUser);
  const deleteUserMutation = useMutation(api.auth.deleteUser);

  // Pour le menu d'action à 3 points
  const [openMenuUserId, setOpenMenuUserId] = useState(null);
  
  const [filterNom, setFilterNom] = useState("");
  const [filterEmail, setFilterEmail] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterPromotion, setFilterPromotion] = useState("");
  const [filterSpecialite, setFilterSpecialite] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({ nom: "", prenom: "", email: "", role: "", promotion: "", specialite: "" });
  const [tempPassword, setTempPassword] = useState(null);

  const supprimerUtilisateur = async (id) => {
    const userToDelete = users.find((user) => user._id === id);
    if (userToDelete && window.confirm(`Êtes-vous sûr de vouloir supprimer ${userToDelete.nom} ${userToDelete.prenom} ?`)) {
      try {
        await deleteUserMutation({ userId: id });
      } catch (err) {
        console.error("Erreur suppression utilisateur:", err);
        alert("Suppression échouée.");
      }
    }
  };

  // Normalisation du rôle
  const normalizeRole = (role) => {
    let r = role.toLowerCase();
    if (["etudiant", "étudiant", "etudiante", "étudiante"].includes(r)) return "Étudiant";
    if (r === "parents" || r === "parent") return "Parents";
    if (r === "admin" || r === "administrateur") return "Admin";
    return role;
  };

  // Normalisation de la promotion (ajusté pour les différentes années)
  const normalizePromotion = (promo) => {
    if (!promo) return "";
    let p = promo.toLowerCase();
    if (p.includes("bachelor 1")) return "Bachelor I";
    if (p.includes("bachelor 2")) return "Bachelor II";
    if (p.includes("bachelor 3")) return "Bachelor III";
  if (p.includes("mastère 1")) return "Mastère I";
  if (p.includes("mastère 2")) return "Mastère II";
    return promo;
  };

  // Normalisation de la spécialité
  const normalizeSpecialite = (spec) => {
    if (!spec) return "";
    let s = spec.toLowerCase();
    if (s.includes("data") && s.includes("ia")) return "Data & IA";
    if (s.includes("cyber")) return "Cybersécurité";
    if (s.includes("dev")) return "Développement";
    if (s.includes("market")) return "Marketing Digital";
    if (s.includes("3d")) return "Animation 3D";
    return spec;
  };

  // Ajouter ou Modifier utilisateur
  const handleSaveUser = async () => {
    if (!userForm.nom || !userForm.prenom || !userForm.email || !userForm.role) {
      alert("Veuillez remplir tous les champs obligatoires !");
      return;
    }
    if (userForm.role === "Étudiant" && (!userForm.promotion || !userForm.specialite)) {
      alert("Veuillez spécifier la promotion et la spécialité pour un étudiant.");
      return;
    }

    const newUser = {
      firstName: userForm.prenom,
      lastName: userForm.nom,
      email: userForm.email,
      role: normalizeRole(userForm.role),
      promotion: normalizePromotion(userForm.promotion),
      specialite: normalizeSpecialite(userForm.specialite),
    };

    try {
      if (editingUser && editingUser._id) {
        await updateUserMutation({
          userId: editingUser._id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          role: newUser.role,
          promotion: newUser.promotion,
          specialite: newUser.specialite,
        });
        // Close form after editing
        setUserForm({ nom: "", prenom: "", email: "", role: "", promotion: "", specialite: "" });
        setEditingUser(null);
        setShowForm(false);
      } else {
        const result = await adminInsertUser({
          email: newUser.email,
          role: newUser.role,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          promotion: newUser.promotion,
          specialite: newUser.specialite,
        });
        if (result && result.tempPassword) {
          setTempPassword(result.tempPassword);
          // Don't close the form, show the password instead
        } else {
          // Something went wrong, close the form
          setUserForm({ nom: "", prenom: "", email: "", role: "", promotion: "", specialite: "" });
          setEditingUser(null);
          setShowForm(false);
        }
      }
    } catch (err) {
      console.error("Erreur lors de l'enregistrement de l'utilisateur:", err);
      if (err.message.includes("User with this email already exists")) {
        alert("Un utilisateur avec cet email existe déjà.");
      } else {
        alert("Échec de l'enregistrement.");
      }
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setUserForm({ nom: user.nom, prenom: user.prenom, email: user.email, role: user.role, promotion: user.promotion, specialite: user.specialite });
    setShowForm(true);
  };

  const filteredUsers = users.filter((user) => {
    const nomMatch = user.nom.toLowerCase().includes(filterNom.toLowerCase());
    const prenomMatch = (user.prenom || '').toLowerCase().includes((filterPrenom || '').toLowerCase());
    const emailMatch = (user.email || '').toLowerCase().includes((filterEmail || '').toLowerCase());

    const userRoleNormalized = normalizeRole(user.role);
    const filterRoleNormalized = normalizeRole(filterRole);
    const roleMatch = filterRoleNormalized === "" || userRoleNormalized === filterRoleNormalized;

    const userPromotionNormalized = normalizePromotion(user.promotion);
    const filterPromotionNormalized = normalizePromotion(filterPromotion);
    const promotionMatch = filterPromotionNormalized === "" || userPromotionNormalized === filterPromotionNormalized;

    // Filtre année
    const promo = user.promotion || "";
    const matchAnnee = promo.match(/(\d{4}-\d{4})/);
    const annee = matchAnnee ? matchAnnee[1] : "";
    const anneeMatch = filterAnnee === "" || annee.includes(filterAnnee);

    const userSpecialiteNormalized = normalizeSpecialite(user.specialite);
    const filterSpecialiteNormalized = normalizeSpecialite(filterSpecialite);
    const specialiteMatch = filterSpecialiteNormalized === "" || userSpecialiteNormalized === filterSpecialiteNormalized;

    return nomMatch && prenomMatch && emailMatch && roleMatch && promotionMatch && anneeMatch && specialiteMatch;
  });

  return (

    <DashboardLayout pageTitle="Gestion des utilisateurs" pageDescription="Consultez et gérez les utilisateurs de la plateforme">
      <div className="gestion-container">
        <div className="main-content">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
            <button
              className="add-button"
              style={{ padding: '0.7rem 1.5rem', fontSize: '1rem', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 8px rgba(45,114,254,0.08)' }}
              onClick={() => { setTempPassword(null); setShowForm(true); setEditingUser(null); setUserForm({ nom: "", prenom: "", email: "", role: "", promotion: "", specialite: "" }); }}
            >
              + Ajouter un utilisateur
            </button>
          </div>

          {showForm && (
            <div className="modal">
              <div className="modal-content">
                <h2>{editingUser ? "Modifier un utilisateur" : "Ajouter un utilisateur"}</h2>
                <input
                  type="text"
                  placeholder="Nom"
                  value={userForm.nom}
                  onChange={(e) => setUserForm({ ...userForm, nom: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Prénom"
                  value={userForm.prenom}
                  onChange={(e) => setUserForm({ ...userForm, prenom: e.target.value })}
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                />
                <select
                  value={userForm.role}
                  onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                >
                  <option value="">Sélectionner un rôle</option>
                  <option value="Étudiant">Étudiant</option>
                  <option value="Parents">Parents</option>
                  <option value="Admin">Admin</option>
                </select>
                {userForm.role === "Étudiant" && (
                  <>
                    <select
                      value={userForm.promotion}
                      onChange={(e) => setUserForm({ ...userForm, promotion: e.target.value })}
                    >
                      <option value="">Sélectionner une promotion</option>
                      <option value="Bachelor I">Bachelor 1</option>
                      <option value="Bachelor II">Bachelor 2</option>
                      <option value="Bachelor III">Bachelor 3</option>
                      <option value="Mastère I">Mastère 1</option>
                      <option value="Mastère II">Mastère 2</option>
                    </select>
                    <select
                      value={userForm.specialite}
                      onChange={(e) => setUserForm({ ...userForm, specialite: e.target.value })}
                    >
                      <option value="">Sélectionner une spécialité</option>
                      <option value="Data & IA">Data & IA</option>
                      <option value="Cybersécurité">Cybersécurité</option>
                      <option value="Développement">Développement</option>
                      <option value="Informatique">Informatique</option>
                    </select>
                  </>
                )}

                

                {tempPassword ? (
                  <div className="temp-password-section">
                    <h3>Utilisateur ajouté avec succès!</h3>
                    <p>Voici le mot de passe temporaire:</p>
                    <input type="text" value={tempPassword} readOnly />
                    <button className="confirm-button" onClick={() => {
                      setShowForm(false);
                      setEditingUser(null);
                      setTempPassword(null);
                      setUserForm({ nom: "", prenom: "", email: "", role: "", promotion: "", specialite: "" });
                    }}>Fermer</button>
                  </div>
                ) : (
                  <div className="modal-actions" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: 16 }}>
                    <button className="cancel-button" onClick={() => { setShowForm(false); setEditingUser(null); }}>Annuler</button>
                    <button className="confirm-button" onClick={handleSaveUser}>{editingUser ? "Modifier" : "Ajouter"}</button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Filtres */}
          <div
            style={{
              margin: '0 auto 24px auto',
              background: '#fff',
              borderRadius: 10,
              boxShadow: '0 2px 10px rgba(0,0,0,0.07)',
              padding: '16px 20px 10px 20px',
              maxWidth: 950,
              minWidth: 220,
              width: '100%',
              position: 'relative',
            }}
          >
            <span style={{ position: 'absolute', top: 10, left: 22, fontWeight: 'bold', fontSize: '1.1rem', color: '#333', letterSpacing: '0.5px' }}>Filtres</span>
            <div style={{ height: '1.7rem' }}></div>
            <div style={{ display: 'flex', gap: 24, marginBottom: 18, flexWrap: 'wrap', justifyContent: 'center' }}>
              {/* Filtre Nom */}
              <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                <FaIdBadge style={{ position: 'absolute', left: 12, top: 13, color: '#bdbdbd', fontSize: 18 }} />
                <input
                  type="text"
                  placeholder="Nom"
                  value={filterNom}
                  onChange={e => setFilterNom(e.target.value)}
                  style={{
                    borderRadius: 8,
                    border: '1.5px solid #e6e6e6',
                    padding: '12px 16px 12px 38px',
                    fontSize: 16,
                    minWidth: 120,
                    background: '#fafbfc',
                    outline: 'none',
                    transition: 'border 0.2s',
                  }}
                />
              </div>
              {/* Filtre Prénom */}
              <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                <FaUser style={{ position: 'absolute', left: 12, top: 13, color: '#bdbdbd', fontSize: 18 }} />
                <input
                  type="text"
                  placeholder="Prénom"
                  value={filterPrenom}
                  onChange={e => setFilterPrenom(e.target.value)}
                  style={{
                    borderRadius: 8,
                    border: '1.5px solid #e6e6e6',
                    padding: '12px 16px 12px 38px',
                    fontSize: 16,
                    minWidth: 120,
                    background: '#fafbfc',
                    outline: 'none',
                    transition: 'border 0.2s',
                  }}
                />
              </div>
              {/* Filtre Email */}
              <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                <FaUser style={{ position: 'absolute', left: 12, top: 13, color: '#bdbdbd', fontSize: 18 }} />
                <input
                  type="text"
                  placeholder="Email"
                  value={filterEmail || ''}
                  onChange={e => setFilterEmail(e.target.value)}
                  style={{
                    borderRadius: 8,
                    border: '1.5px solid #e6e6e6',
                    padding: '12px 16px 12px 38px',
                    fontSize: 16,
                    minWidth: 120,
                    background: '#fafbfc',
                    outline: 'none',
                    transition: 'border 0.2s',
                  }}
                />
              </div>
              {/* Filtre Rôle */}
              <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                <FaCogs style={{ position: 'absolute', left: 12, top: 13, color: '#bdbdbd', fontSize: 18 }} />
                <select
                  value={filterRole}
                  onChange={e => setFilterRole(e.target.value)}
                  style={{
                    borderRadius: 8,
                    border: '1.5px solid #e6e6e6',
                    padding: '12px 16px 12px 38px',
                    fontSize: 16,
                    minWidth: 120,
                    background: '#fafbfc',
                    outline: 'none',
                    transition: 'border 0.2s',
                  }}
                >
                  <option value="">Rôle</option>
                  <option value="Étudiant">Étudiant</option>
                  <option value="Parents">Parents</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                <FaCalendarAlt style={{ position: 'absolute', left: 12, top: 13, color: '#bdbdbd', fontSize: 18 }} />
                <select
                  value={filterAnnee}
                  onChange={e => setFilterAnnee(e.target.value)}
                  style={{
                    borderRadius: 8,
                    border: '1.5px solid #e6e6e6',
                    padding: '12px 16px 12px 38px',
                    fontSize: 16,
                    minWidth: 120,
                    background: '#fafbfc',
                    outline: 'none',
                    transition: 'border 0.2s',
                  }}
                >
                  <option value="">Année</option>
                  <option value="2019-2020">2019-2020</option>
                  <option value="2020-2021">2020-2021</option>
                  <option value="2021-2022">2021-2022</option>
                  <option value="2022-2023">2022-2023</option>
                  <option value="2023-2024">2023-2024</option>
                  <option value="2024-2025">2024-2025</option>
                  <option value="2025-2026">2025-2026</option>
                  <option value="2026-2027">2026-2027</option>
                  <option value="2027-2028">2027-2028</option>
                  <option value="2028-2029">2028-2029</option>
                  <option value="2029-2030">2029-2030</option>
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                <FaLayerGroup style={{ position: 'absolute', left: 12, top: 13, color: '#bdbdbd', fontSize: 18 }} />
                <select value={filterPromotion} onChange={e => setFilterPromotion(e.target.value)} style={{ borderRadius: 8, border: '1.5px solid #e6e6e6', padding: '12px 16px 12px 38px', fontSize: 16, background: '#fafbfc', minWidth: 120 }}>
                  <option value="">Promotion</option>
                  <option value="Bachelor 1">Bachelor 1</option>
                  <option value="Bachelor 2">Bachelor 2</option>
                  <option value="Bachelor 3">Bachelor 3</option>
                  <option value="Mastère 1">Mastère 1</option>
                  <option value="Mastère 2">Mastère 2</option>
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                <FaCogs style={{ position: 'absolute', left: 12, top: 13, color: '#bdbdbd', fontSize: 18 }} />
                <select value={filterSpecialite} onChange={e => setFilterSpecialite(e.target.value)} style={{ borderRadius: 8, border: '1.5px solid #e6e6e6', padding: '12px 16px 12px 38px', fontSize: 16, background: '#fafbfc', minWidth: 120 }}>
                  <option value="">Spécialité</option>
                  <option value="Data & IA">Data & IA</option>
                  <option value="Cybersécurité">Cybersécurité</option>
                  <option value="Développement">Développement</option>
                  <option value="Informatique">Informatique</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tableau des utilisateurs */}
          <table className="users-table">
            <thead>
              <tr>
                <th>Profil</th>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>Promotion</th>
                <th>Année</th>
                <th>Spécialité</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ position: 'relative', width: 36, height: 36 }}>
                      <img src={user.photoUrl} alt="profil" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '1.5px solid #e6e6e6' }} />
                      <span style={{
                        position: 'absolute',
                        right: 2,
                        bottom: 2,
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        background: user.isOnline ? '#32CD32' : '#FF0000',
                        border: '2px solid #fff',
                        boxShadow: '0 0 2px #888',
                        display: 'inline-block',
                      }} />
                    </div>
                  </td>
                  <td>{user.nom}</td>
                  <td>{user.prenom}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{(() => {
                    // Extraire l'année si présente dans la promotion
                    const promo = user.promotion || "";
                    let promoLabel = promo;
                    // Chercher un format d'année AAAA-AAAA
                    const match = promo.match(/(\d{4}-\d{4})/);
                    if (match) {
                      promoLabel = promo.replace(match[1], '').trim();
                    }
                    // Remplacer les chiffres romains par 1, 2, 3, ...
                    promoLabel = promoLabel
                      .replace(/Bachelor ?I{1,3}/i, (m) => {
                        if (/I{3}/i.test(m)) return 'Bachelor 3';
                        if (/I{2}/i.test(m)) return 'Bachelor 2';
                        return 'Bachelor 1';
                      })
                      .replace(/Mast[èe]re ?I{1,2}/i, (m) => {
                        if (/I{2}/i.test(m)) return 'Mastère 2';
                        return 'Mastère 1';
                      });
                    return promoLabel;
                  })()}</td>
                  <td>{(() => {
                    const promo = user.promotion || "";
                    const match = promo.match(/(\d{4}-\d{4})/);
                    return match ? match[1] : "";
                  })()}</td>
                  <td>{user.specialite}</td>
                  <td style={{ position: 'relative' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
                      <button
                        className="ellipsis-action"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuUserId(user._id === openMenuUserId ? null : user._id);
                        }}
                      >
                        <FiMoreVertical size={22} />
                      </button>
                      {openMenuUserId === user._id && (
                        <div
                          className="user-action-menu"
                          style={{
                            position: 'absolute',
                            top: '2.2rem',
                            right: 0,
                            background: '#fff',
                            border: '1px solid #e0e0e0',
                            borderRadius: '8px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                            zIndex: 10,
                            minWidth: '140px',
                            padding: '0.5rem 0',
                          }}
                        >
                          <div
                            className="user-action-item"
                            style={{ padding: '0.7rem 1.2rem', cursor: 'pointer', fontSize: '1rem' }}
                            onClick={() => { setOpenMenuUserId(null); navigate(`/utilisateur/${user._id}`); }}
                          >
                            Détails
                          </div>
                          <div
                            className="user-action-item"
                            style={{ padding: '0.7rem 1.2rem', cursor: 'pointer', fontSize: '1rem' }}
                            onClick={() => { setOpenMenuUserId(null); handleEditUser(user); }}
                          >
                            Modifier
                          </div>
                          <div
                            className="user-action-item"
                            style={{ padding: '0.7rem 1.2rem', cursor: 'pointer', color: '#e53935', fontWeight: 600, fontSize: '1rem' }}
                            onClick={() => { setOpenMenuUserId(null); supprimerUtilisateur(user._id); }}
                          >
                            Supprimer
                          </div>
                        </div>
                      )}
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
    
  );
};

export default GestionUtilisateurs;