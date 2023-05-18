import { v2 } from "cloudinary";
import { checkValidator } from "../utils/handle-validator";
import { CreateRoomInput, UpdateRoomInput } from "../interface";
import {
  createRoom,
  findRoom,
  findRoomById,
  findRoomByType,
  findRoomIdAndUpdate,
} from "../repositories";

export class RoomService {
  static async getAll() {
    return await findRoom();
  }

  static async getOneById(id: string) {
    return await findRoomById(id);
  }

  static async getRoomByTypeId(id: string) {
    return await findRoomByType(id);
  }

  static async newRoom(input: CreateRoomInput) {
    console.log(input);
    const {
      acreage,
      address,
      body,
      description,
      form,
      phoneConnect,
      short_description,
      title,
      to,
      type,
      utilities,
      user_booking,
      images,
    } = input;
    const resImage = await v2.uploader.upload(images, {
      folder: "room",
      format: "png",
    });

    const bodyInput = {
      info: {
        acreage,
        address,
        phoneConnect,
        utilities,
      },
      body,
      description,
      short_description,
      title,
      to,
      form,
      type,
      user_booking,
      image: {
        public_id: resImage.public_id,
        url: resImage.url,
      },
    };

    return await createRoom(bodyInput);
  }

  static async updateRoom(input: UpdateRoomInput, id: string) {
    await checkValidator(UpdateRoomInput, input);
    const {
      acreage,
      address,
      body,
      description,
      form,
      phoneConnect,
      short_description,
      title,
      to,
      type,
      utilities,
      user_booking,
      images,
    } = input;
    if (images) {
      const room = await findRoomById(id);
      await v2.uploader.destroy(room.image?.public_id as string);
      const resImage = await v2.uploader.upload(images, {
        folder: "room",
        format: "png",
      });
      const bodyInput = {
        info: {
          acreage,
          address,
          phoneConnect,
          utilities,
        },
        body,
        description,
        short_description,
        title,
        to,
        form,
        type,
        user_booking,
        image: {
          public_id: resImage.public_id,
          url: resImage.url,
        },
      };
      return await findRoomIdAndUpdate(bodyInput, id);
    }
    const bodyInput = {
      info: {
        acreage,
        address,
        phoneConnect,
        utilities,
      },
      body,
      description,
      short_description,
      title,
      to,
      form,
      type,
      user_booking,
    };

    return await findRoomIdAndUpdate(bodyInput, id);
  }
}
