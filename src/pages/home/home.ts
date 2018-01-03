import { Component } from "@angular/core";
import { NavController, Platform } from "ionic-angular";
import { Camera, CameraOptions } from "@ionic-native/camera";
import { Storage } from "@ionic/storage";

@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {
  public base64Image: string[];
  public extraOptions: any;

  constructor(
    public navCtrl: NavController,
    private camera: Camera,
    private storage: Storage,
    private platform: Platform
  ) {
    this.base64Image = new Array();

    this.extraOptions = {
      pager: true,
      paginationClickable: true,
      spaceBetween: 30,
      centeredSlides: true,
      autoplay: 2000
    };

    // get data from storage
    this.platform.ready().then(() => {
      this.storage.get("photos").then(
        data => {
          if (data) {
            this.base64Image = data.split(",");
          }
        },
        error => {
          console.log("error in getting photos " + error);
        }
      );
    });
  }

  takePicture() {
    const options: CameraOptions = {
      quality: 75,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: this.camera.EncodingType.JPEG,
      targetWidth: 300,
      targetHeight: 300,
      saveToPhotoAlbum: false,
      mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(options).then(
      imageUri => {
        console.log("imageUri is " + imageUri);
        this.base64Image.push(imageUri);
        let imageUris = this.base64Image.map(o => o).join(", ");
        console.log("imageUris is " + imageUris);

        // save data into storage
        this.storage
          .set("photos", imageUris)
          .then(
            () => console.log("Stored item!"),
            error => console.error("Error storing item", error)
          );
      },
      err => {
        console.log("camera error is" + err);
      }
    );
  }
}
