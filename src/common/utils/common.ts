import { Model } from 'mongoose';
import { UserDocument } from 'src/modules/user/schemas/user.schema';
import mongoose from 'mongoose';

const ObjectId = mongoose.Schema.Types.ObjectId;

export function removeVNLang(str: any): string {
  if (str) {
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    str = str.replace(/đ/g, 'd');
    // str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
    str = str.replace(/ + /g, ' ');
    str = str.trim();
  }
  return str;
}

export const userInTree = ({ tree, username }: { tree: string; username: string }) => {
  if (!tree) return true;
  const arr = tree.split('|');

  return arr.includes(username);
};

export const getUserRefs = async (userId: string, userModel: Model<UserDocument>) => {
  let result = [];

  const refs = await userModel.find({ ref: userId });
  result = [...result, ...refs.map(user => ({ id: user.id, isActive: user.isActive }))];
  if (refs.length) {
    const refsChild = (await Promise.all(refs.map(async ref => await getUserRefs(ref.id, userModel))))
      .flat()
      .map(user => ({ id: user.id, isActive: user.isActive }));
    result = [...result, ...refsChild];
  }
  return result;
};
