import {
  LANDSCAPE_WIDTH,
  LANDSCAPE_HEIGHT,
  PORTRAIT_HEIGHT,
  PORTRAIT_WIDTH
} from "./ItemTypes";

export const calculateLandscapeMeazures = (width, height) => {
  const aspect = width / height;
  console.log(width, height);
  if (width > LANDSCAPE_WIDTH) {
    if (height > LANDSCAPE_HEIGHT) {
      if (width >= height) {
        return {
          width: LANDSCAPE_WIDTH / 2,
          height: LANDSCAPE_WIDTH / aspect / 2
        };
      } else
        return {
          height: LANDSCAPE_HEIGHT / 2,
          width: (LANDSCAPE_HEIGHT / 2) * aspect
        };
    } else {
      return {
        width: LANDSCAPE_WIDTH,
        height: LANDSCAPE_WIDTH / aspect
      };
    }
  } else if (height > LANDSCAPE_HEIGHT) {
    return {
      height: LANDSCAPE_HEIGHT,
      width: LANDSCAPE_HEIGHT * aspect
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
  } else if (width > PORTRAIT_HEIGHT) {
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
