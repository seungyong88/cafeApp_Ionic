<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>포토 갤러리</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
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
import { IonPage, IonHeader, IonFab, IonFabButton, IonIcon, IonToolbar, IonTitle, IonContent  } from '@ionic/vue';
import { usePhotoGallery } from '@/composables/usePhotoGallery';

// IonGrid, IonRow, IonCol, IonImg
// IonGrid, IonRow, IonCol, IonImg
export default  {
  name: 'Tab2',
  components: { IonPage, IonHeader, IonFab, IonFabButton, IonIcon, IonToolbar, IonTitle, IonContent },
  setup() {
    return {
      camera, trash, close
    }
  }
}
</script>