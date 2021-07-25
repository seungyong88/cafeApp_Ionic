<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>포토 갤러리</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-grid>
        <ion-row>
          <ion-col size="6" v-for="photo in photos" :key="photo">
            <ion-img :src="photo.webviewPath"></ion-img>
          </ion-col>
        </ion-row>
      </ion-grid>

      <ion-fab vertical="bottom" horizontal="center" slot="fixed">
        <ion-fab-button @click="takePhoto()">
          <ion-icon :icon="camera"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
// import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';

import { camera, trash, close } from 'ionicons/icons';
import { IonIcon, IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonFab, IonFabButton, IonGrid, IonRow, IonCol, IonImg } from '@ionic/vue';
import { usePhotoGallery, UserPhoto } from '@/composables/usePhotoGallery';

export default  {
  name: 'Tab2',
  components: { IonIcon, IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonFab, IonFabButton, IonGrid, IonRow, IonCol, IonImg  },
  setup() {
    const { takePhoto, photos } = usePhotoGallery();
    return {
      camera, trash, close, takePhoto, photos
    }
  }
}
</script>