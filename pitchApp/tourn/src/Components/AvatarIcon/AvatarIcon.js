import React, { Component } from 'react';
import Avatar from 'avataaars2';

var codes = [
  [0.50,0.70,0.69,0.10,0.00,0.47,0.43,0.00,0.60,0.60,0.77,0.14,0.60],
  [0.84,0.67,0.01,0.72,0.00,0.19,0.36,0.92,0.96,0.03,0.23,0.89,0.29],
  [0.66,0.69,0.42,0.67,0.00,0.94,0.95,0.32,0.95,0.06,0.63,0.31,0.29],
  [0.93,0.00,0.30,0.40,0.40,0.70,0.22,0.34,0.15,0.75,0.18,0.85,0.50],
  [0.59,0.49,0.24,0.18,0.00,0.08,0.79,0.32,0.26,0.07,0.91,0.82,0.74],
  [0.01,0.00,0.22,0.05,0.00,0.15,0.87,0.65,0.58,0.00,0.41,0.35,0.50],
  [0.63,0.96,0.04,0.62,0.00,0.54,0.26,0.48,0.92,0.97,0.26,0.55,0.04],
  [0.20,0.65,0.42,0.62,0.00,0.45,0.10,0.16,0.57,0.90,0.96,0.99,0.72],
  [0.79,0.00,0.26,0.53,0.00,0.33,0.20,0.95,0.71,0.39,0.81,0.30,0.98],
  [0.00,0.09,0.23,0.37,0.00,0.28,0.49,0.64,1.00,0.00,0.99,0.62,0.74],
  [0.85,0.36,0.91,0.79,0.00,0.68,0.61,0.46,0.36,0.85,0.79,0.69,0.54],
  [0.08,0.92,0.45,0.52,0.00,0.71,0.63,0.83,0.83,0.01,0.10,0.80,0.35],
  [0.26,0.00,0.57,0.34,0.00,0.88,0.70,0.74,0.51,0.76,0.13,0.56,0.70],
  [0.63,0.57,0.28,0.14,0.00,0.90,0.82,0.41,0.58,0.72,0.20,0.29,0.65],
  [0.44,0.00,0.88,0.70,0.00,0.18,0.45,0.48,0.34,0.99,0.29,0.92,0.07],
  [0.59,0.92,0.55,0.43,0.00,0.65,0.44,0.24,0.17,0.47,0.39,0.53,0.50],
  [0.26,0.18,0.81,0.35,0.00,0.13,0.42,0.75,0.38,0.35,0.52,0.90,0.49],
  [0.18,0.00,1.00,0.29,0.00,0.13,0.67,0.86,0.71,0.70,0.66,0.89,0.83],
  [0.18,0.40,0.42,0.11,0.00,0.63,0.61,0.17,0.97,0.00,0.83,0.85,0.20],
  [0.13,0.00,0.44,0.50,0.00,0.95,0.49,0.24,0.18,0.00,0.39,0.70,0.27],
  [0.52,0.00,0.89,0.33,0.00,0.81,0.88,0.42,0.64,0.16,0.32,0.36,0.07],
  [0.42,0.69,0.20,0.47,0.00,0.42,0.46,0.94,0.91,0.15,0.76,0.34,0.30],
  [0.83,0.00,0.42,0.12,0.00,0.33,0.43,0.43,0.93,0.37,0.40,0.88,0.84],
  [0.75,0.39,0.79,0.40,0.00,0.67,0.37,0.70,0.39,0.89,0.84,0.70,0.54],
  [0.59,0.00,0.23,0.02,0.00,0.05,0.03,0.99,0.81,0.23,0.67,0.22,0.41],
  [0.28,0.80,0.03,0.39,0.00,0.21,0.89,0.01,0.92,0.94,0.89,0.23,0.59],
  [0.75,0.00,0.66,0.69,0.00,0.40,0.84,0.55,0.84,0.12,0.78,0.47,0.51],
  [0.23,0.26,0.86,0.76,0.00,0.85,0.13,0.44,0.40,0.47,0.23,0.68,0.25],
  [0.65,0.00,0.37,0.58,0.00,0.21,0.04,0.01,0.06,0.93,0.79,0.00,0.73],
  [0.06,0.00,0.20,0.07,0.00,0.03,0.56,0.74,0.13,0.43,0.31,0.75,0.64],
  [0.02,0.10,0.00,0.00,0.40,0.57,0.12,0.00,0.02,0.67,0.30,0.64,0.74],
  [0.00,0.83,0.17,0.22,0.50,0.10,0.50,0.53,0.52,0.91,0.19,0.23,0.02],
  [0.57,0.00,0.49,0.96,0.00,0.74,0.02,0.71,0.53,0.00,0.92,0.05,0.43],
  [0.93,0.00,0.44,0.29,0.00,0.46,0.42,0.22,0.51,0.82,0.67,0.35,0.90],
  [0.08,0.00,0.75,0.95,0.00,0.20,0.19,0.44,0.13,0.44,0.54,0.77,0.82],
  [0.33,0.48,0.51,0.81,0.00,0.98,0.15,0.77,0.52,0.11,0.90,0.59,0.11],
  [0.87,0.00,0.14,0.45,0.00,0.08,0.76,0.37,0.84,0.86,0.27,0.45,0.04],
  [0.96,0.29,0.74,0.99,0.00,0.97,0.11,0.46,0.01,0.16,0.25,0.85,0.13],
  [0.65,0.00,0.93,0.06,0.00,0.01,0.63,0.12,0.18,0.86,0.82,0.58,0.34],
  [0.21,0.27,0.62,0.54,0.00,0.04,0.56,0.87,0.97,0.81,0.68,0.94,0.92],
  [0.51,0.00,0.71,0.26,0.00,0.94,0.94,0.29,0.15,0.43,0.56,0.91,0.20],
  [0.89,0.00,0.68,0.71,0.00,0.72,0.74,0.74,0.72,0.68,0.70,0.68,0.26],
  [0.47,0.53,0.13,0.75,0.00,0.88,0.17,0.97,0.53,0.57,0.15,0.78,0.95],
  [0.92,0.24,0.44,0.81,0.00,0.40,0.04,0.53,0.57,0.31,0.93,0.33,0.20],
  [0.65,0.61,0.06,0.02,0.00,0.09,0.78,0.89,0.07,0.72,0.35,0.57,0.53],
  [0.54,0.35,0.95,0.99,0.00,0.34,0.28,0.55,0.29,0.63,0.48,0.96,0.64],
  [0.97,0.14,0.38,0.89,0.00,0.99,0.44,0.05,0.99,0.06,0.70,0.32,0.66],
  [0.85,0.89,0.13,0.82,0.00,0.31,0.71,0.39,0.46,0.63,0.95,0.73,0.72],
  [0.57,0.56,0.99,0.89,0.00,0.72,0.20,0.87,0.54,0.41,0.50,0.12,0.59],
  [0.13,0.19,0.30,0.67,0.00,0.60,0.36,0.04,0.90,0.05,0.48,0.28,0.75],
  [0.50,0.41,0.73,0.23,0.00,0.64,0.14,0.55,0.38,0.78,0.79,0.06,0.77],
  [0.73,0.08,0.85,0.29,0.00,0.00,0.62,0.27,0.98,0.80,0.44,0.96,0.78],
  [0.52,0.45,0.73,0.99,0.00,0.68,0.74,0.34,0.43,0.41,0.64,0.92,0.75],
  [0.67,0.99,0.27,0.93,0.00,0.63,0.90,0.42,0.84,0.92,0.19,0.01,0.92],
  [0.64,0.46,0.97,0.88,0.00,0.60,0.64,0.57,0.30,0.42,0.16,0.66,0.46],
  [0.64,0.93,0.23,0.08,0.00,0.18,0.96,0.69,0.14,0.54,0.28,0.70,0.98],
  [0.03,0.23,0.26,0.12,0.00,0.98,0.74,0.55,0.06,0.62,0.00,0.81,0.13],
  [0.56,0.43,0.37,0.98,0.00,0.97,0.49,0.00,0.17,0.25,0.73,0.52,0.65],
  [0.67,0.61,0.76,0.76,0.00,0.82,0.73,0.14,0.98,0.79,0.12,0.74,0.80],
  [0.05,0.15,0.03,0.93,0.00,0.09,0.32,0.25,0.06,0.94,0.57,0.14,0.22],
  [0.18,0.48,0.48,1.00,0.00,0.19,0.49,0.92,0.19,0.29,0.62,0.01,0.56],
  [0.29,0.40,0.83,0.42,0.00,0.77,0.72,0.00,0.35,0.32,0.47,0.90,0.29],
  [0.90,0.22,0.41,0.05,0.00,0.14,0.09,0.13,0.96,0.40,0.32,0.89,0.35],
  [0.14,0.58,0.43,0.29,0.00,0.47,0.24,0.67,0.69,0.72,0.40,0.82,0.75],
  [0.14,0.68,0.23,0.66,0.00,0.60,0.03,0.34,0.42,0.31,0.15,0.05,0.76],
  [0.46,0.94,0.48,0.89,0.00,0.66,0.09,0.92,0.36,0.55,0.45,0.22,0.06],
  [0.06,0.99,0.43,0.49,0.00,0.94,0.29,0.33,0.33,0.88,0.98,0.59,0.66],
  [0.22,0.35,0.58,0.97,0.00,0.36,0.72,0.65,0.53,0.12,0.67,0.47,0.92],
  [0.96,0.57,0.69,0.13,0.00,0.43,0.60,0.33,0.93,0.56,0.78,0.25,0.54],
  [0.08,0.26,0.18,0.13,0.00,0.12,0.20,0.70,0.76,0.92,0.39,0.50,0.20],
  [0.19,0.40,0.34,0.88,0.00,0.31,0.38,0.13,0.77,0.27,0.09,0.09,0.87],
  [0.31,0.51,0.34,0.01,0.00,0.92,0.76,0.70,0.78,0.89,0.29,0.92,0.64],
  [0.83,0.88,0.91,0.14,0.00,0.41,0.77,0.38,0.59,0.90,0.42,0.16,0.03],
  [0.43,0.85,0.85,0.95,0.00,0.73,0.52,0.16,0.16,0.13,0.31,0.38,0.89],
  [0.60,0.52,0.38,0.58,0.00,0.05,0.68,0.75,0.84,0.07,0.86,0.45,0.05],
  [0.04,0.56,0.84,0.77,0.00,0.72,0.66,0.09,0.89,0.32,0.22,0.57,0.18],
  [0.78,0.02,0.53,0.11,0.00,0.12,0.09,0.69,0.13,0.68,0.91,0.08,0.80],
  [0.34,0.07,0.32,0.85,0.00,0.06,0.45,0.41,0.39,0.28,0.34,0.53,0.09],
  [0.88,0.95,0.52,0.21,0.00,0.09,0.08,0.23,0.13,0.06,0.94,0.86,0.65],
  [0.60,0.90,0.65,0.96,0.00,0.23,0.80,0.31,0.71,0.17,0.39,0.14,0.30],
  [0.97,0.89,1.00,0.52,0.00,0.66,0.77,0.91,0.33,0.49,0.10,0.09,0.80],
  [0.19,0.83,0.75,0.74,0.00,0.02,0.96,0.94,0.53,0.08,0.53,0.24,0.64],
  [0.15,0.36,0.55,0.88,0.00,0.33,0.15,0.06,0.16,0.39,0.40,0.51,0.35],
  [0.62,0.75,0.79,0.00,0.00,0.54,0.70,0.48,0.83,0.77,0.65,0.75,0.02],
  [0.91,0.92,0.46,0.26,0.00,0.05,0.06,0.43,0.41,0.45,0.24,0.35,0.52],
  [0.04,0.08,0.71,0.51,0.00,0.28,0.20,0.17,0.60,0.46,0.51,0.04,0.51],
  [0.77,0.86,0.72,0.16,0.00,0.27,0.14,0.55,0.86,0.49,0.26,0.39,0.08],
  [0.67,0.56,0.97,0.87,0.00,0.48,0.01,0.91,0.99,0.92,0.18,0.83,0.03],
  [0.26,0.86,0.65,0.95,0.00,0.83,0.22,0.10,0.14,0.34,0.61,0.20,0.24],
  [0.12,0.79,0.52,0.90,0.00,0.58,0.91,0.19,0.18,0.94,0.82,0.18,0.32],
  [0.55,0.42,0.18,0.16,0.00,0.07,0.10,0.95,0.92,0.43,0.19,0.77,0.75],
  [0.09,0.65,0.99,0.37,0.00,0.24,0.48,0.84,0.14,0.91,0.03,0.26,0.48],
  [0.26,0.70,0.50,0.39,0.00,0.53,0.97,0.93,0.30,0.56,0.63,0.92,0.04],
  [0.48,0.08,0.72,0.70,0.00,0.22,0.30,0.48,0.05,0.67,0.41,0.64,0.21],
  [0.39,0.76,0.56,0.06,0.00,0.78,0.25,0.93,0.20,0.21,0.85,0.37,0.57],
  [0.04,0.54,0.43,0.85,0.00,0.95,0.97,0.81,0.52,0.92,0.05,0.77,0.25],
  [0.64,0.89,0.89,0.26,0.00,0.45,0.73,0.29,0.13,0.01,0.26,0.54,0.53],
  [0.49,0.80,0.66,0.85,0.00,0.70,0.89,0.55,0.45,0.87,0.07,0.94,0.56],
  [0.46,0.97,0.97,0.05,0.00,0.99,0.10,0.12,0.60,0.60,0.24,0.91,0.22],
  [0.66,0.19,0.64,0.19,0.00,0.52,0.60,0.30,0.12,0.33,0.12,0.15,0.45]
];

const configs = {
  topType: [
    'NoHair',
    'Eyepatch',
    'Hat',
    'Hijab',
    'Turban',
    'WinterHat1',
    'WinterHat2',
    'WinterHat3',
    'WinterHat4',
    'LongHairBigHair',
    'LongHairBob',
    'LongHairBun',
    'LongHairCurly',
    'LongHairCurvy',
    'LongHairDreads',
    'LongHairFrida',
    'LongHairFro',
    'LongHairFroBand',
    'LongHairNotTooLong',
    'LongHairShavedSides',
    'LongHairMiaWallace',
    'LongHairStraight',
    'LongHairStraight2',
    'LongHairStraightStrand',
    'ShortHairDreads01',
    'ShortHairDreads02'
  ],
  accessoriesType: [
    'Blank',
    'Kurt',
    'Prescription01',
    'Prescription02',
    'Round',
    'Sunglasses',
    'Wayfarers'
  ],
  hatColor: [
    'Black',
    'Blue01',
    'Blue02',
    'Blue03',
    'Gray01',
    'Gray02',
    'Heather',
    'PastelBlue',
    'PastelGreen',
    'PastelOrange',
    'PastelRed',
    'PastelYellow',
    'Pink',
    'Red',
    'White'
  ],
  hairColor: [
    'Auburn',
    'Black',
    'Blonde',
    'BlondeGolden',
    'Brown',
    'BrownDark',
    'PastelPink',
    'Platinum',
    'Red',
    'SilverGray'
  ],
  facialHairType: [
    'Blank',
    'BeardMedium',
    'BeardLight',
    'BeardMajestic',
    'MoustacheFancy',
    'MoustacheMagnum'
  ],
  facialHairColor: [
    'Auburn',
    'Black',
    'Blonde',
    'BlondeGolden',
    'Brown',
    'BrownDark',
    'Platinum',
    'Red'
  ],
  clotheType: [
    'BlazerShirt',
    'BlazerSweater',
    'CollarSweater',
    'GraphicShirt',
    'Hoodie',
    'Overall',
    'ShirtCrewNeck',
    'ShirtScoopNeck',
    'ShirtVNeck'
  ],
  clotheColor: [
    'Black',
    'Blue01',
    'Blue02',
    'Blue03',
    'Gray01',
    'Gray02',
    'Heather',
    'PastelBlue',
    'PastelGreen',
    'PastelOrange',
    'PastelRed',
    'PastelYellow',
    'Pink',
    'Red',
    'White'
  ],
  graphicType: [
    'Bat',
    'Cumbia',
    'Deer',
    'Diamond',
    'Hola',
    'Pizza',
    'Resist',
    'Selena',
    'Bear',
    'SkullOutline',
    'Skull'
  ],
  eyeType: [
    'Close',
    'Cry',
    'Default',
    'Dizzy',
    'EyeRoll',
    'Happy',
    'Hearts',
    'Side',
    'Squint',
    'Surprised',
    'Wink',
    'WinkWacky'
  ],
  eyebrowType: [
    'Angry',
    'AngryNatural',
    'Default',
    'DefaultNatural',
    'FlatNatural',
    'RaisedExcited',
    'RaisedExcitedNatural',
    'SadConcerned',
    'SadConcernedNatural',
    'UnibrowNatural',
    'UpDown',
    'UpDownNatural'
  ],
  mouthType: [
    'Concerned',
    'Default',
    'Disbelief',
    'Eating',
    'Grimace',
    'Sad',
    'ScreamOpen',
    'Serious',
    'Smile',
    'Tongue',
    'Twinkle',
    'Vomit'
  ],
  skinColor: [
    'Tanned',
    'Yellow',
    'Pale',
    'Light',
    'Brown',
    'DarkBrown',
    'Black'
  ]
}

const configsKeys = Object.keys(configs);

class AvatarIcon extends Component { 

    constructor(props) {
      super(props);
  }

  generateRandomAvatarOptions() {
    const options = { }
    const keys = [...configsKeys]
    var ctr = 0;
    keys.forEach(key => {
      const configArray = configs[key];
      options[key] = configArray[Math.floor(codes[this.props.codeKey][ctr]*configArray.length)];
      ctr += 1;
    })
  
    return options;
  }


  render() {
      return (
          <div style={{ width: this.props.width, height: this.props.height, float: this.props.float}} onClick={() => this.props.handleAvatarClick(this.props.codeKey)}>
            <Avatar
                style={{ width: this.props.height, height: this.props.height }}
                avatarStyle = 'Circle'
                {...this.generateRandomAvatarOptions() }
            />
          </div>
      );
  }
};

export default AvatarIcon