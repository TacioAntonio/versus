const ASSETS_PATH = '../../../assets/';
const PARENT_CHILD = '/games/';

const GAME_EXEMPLES = Array.from([1, 2, 3, 4, 5], (value: number) => ({
  name: `Game exemple ${value}`,
  icon: `${ASSETS_PATH}icons/game-exemple.png`,
  url: `${PARENT_CHILD}/${value}`
}));

export const gameList = [
  {
    name: 'Color first',
    icon: `${ASSETS_PATH}images-color-first/color-first-icon.png`,
    url: `${PARENT_CHILD}color-first`
  },
  ...GAME_EXEMPLES
];
