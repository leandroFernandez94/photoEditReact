import {
    LANDSCAPE_WIDTH,
    LANDSCAPE_HEIGHT,
    PORTRAIT_HEIGHT,
    PORTRAIT_WIDTH, MARGEN
} from "./ItemTypes";

export const calculateLandscapeMeazures = (width, height) => {
  const aspect = width / height;
  console.log(width, height);
  let landscape_width = LANDSCAPE_WIDTH - 2*MARGEN
    let landscape_height = LANDSCAPE_HEIGHT - 2*MARGEN
  if (width > landscape_width) {
    if (height > landscape_height) {
      if (width >= height) {
        return {
          width: landscape_width / 2,
          height: landscape_width / aspect / 2
        };
      } else
        return {
          height: landscape_height / 2,
          width: (landscape_height / 2) * aspect
        };
    } else {
      return {
        width: landscape_width,
        height: landscape_width / aspect
      };
    }
  } else if (height > landscape_height) {
    return {
      height: landscape_height,
      width: landscape_height * aspect
    };
  }

  return {
    height: height,
    width: width
  };
};

export const calculatePortraitMeazures = (width, height) => {
  const aspect = width / height;
  console.log(width, height);
  if (height > PORTRAIT_HEIGHT) {
    if (width > PORTRAIT_WIDTH) {
      if (height >= width) {
        return {
          height: PORTRAIT_HEIGHT / 2,
          width: (PORTRAIT_WIDTH * aspect) / 2
        };
      } else
        return {
          width: PORTRAIT_WIDTH / 2,
          height: PORTRAIT_WIDTH / aspect / 2
        };
    } else {
      return {
        height: PORTRAIT_HEIGHT,
        width: PORTRAIT_HEIGHT * aspect
      };
    }
  } else if (width > PORTRAIT_WIDTH) {
    return {
      width: PORTRAIT_WIDTH,
      height: PORTRAIT_WIDTH / aspect
    };
  }

  return {
    height: height,
    width: width
  };
};
