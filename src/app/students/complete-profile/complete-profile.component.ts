import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service'; // à adapter selon ton projet
import { ConvexService } from '../../services/convex.service'; // à adapter selon ton projet
import { Router } from '@angular/router';

@Component({
  selector: 'app-complete-profile',
  templateUrl: './complete-profile.component.html',
  styleUrls: ['./complete-profile.component.scss']
})
export class CompleteProfileComponent implements OnInit {
  profile = {
    id: '',
    email: '',
    telephone: '',
    adresse: '',
    pays: '',
    ville: '',
    photo: null as File | null
  };

  constructor(
    private userService: UserService, // doit fournir id/email utilisateur
    private convexService: ConvexService, // doit gérer l'appel à Convex
    private router: Router
  ) {}

  ngOnInit() {
    // Récupérer id et email depuis le service utilisateur (à adapter)
    const user = this.userService.getCurrentUser();
    this.profile.id = user.id;
    this.profile.email = user.email;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.profile.photo = file;
    }
  }

  async onSubmit() {
    const formData = new FormData();
    formData.append('id', this.profile.id);
    formData.append('email', this.profile.email);
    formData.append('telephone', this.profile.telephone);
    formData.append('adresse', this.profile.adresse);
    formData.append('pays', this.profile.pays);
    formData.append('ville', this.profile.ville);
    if (this.profile.photo) {
      formData.append('photo', this.profile.photo);
    }

    try {
      await this.convexService.updateProfile(formData);
      this.router.navigate(['/main-screen']); // à adapter selon ta route principale
    } catch (error) {
      // Gérer l'erreur (affichage, toast, etc.)
      console.error('Erreur lors de la sauvegarde du profil', error);
    }
  }
}
