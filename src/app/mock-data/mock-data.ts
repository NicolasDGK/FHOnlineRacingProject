import { CarDetail } from '../interfaces/interfaces-refactor';

export const MOCK_CARS: CarDetail[] = [
  // ================= S2 CLASS =================
  {
    id: 1,
    name: 'Ferrari F50 GT',
    image_url: 'https://static-wikia-nocookie-net.translate.goog/forzamotorsport/images/c/c9/FH5_Dodge_SRT_Viper_GTS_AE_Large.png',
    class: 'S2',
    isMeta: true,
    tunes: [
      { id: 101, car_id: 1, class: 'S2', creator: 'K1Z Bala', share_code: '236 586 261', types: ['allround'] },
      { id: 102, car_id: 1, class: 'S2', creator: 'TheDannny', share_code: '146 830 372', types: ['allround'], notes: 'Purist' }
    ]
  },
  {
    id: 2,
    name: 'Ferrari FXX-K Evo',
    image_url: 'https://static-wikia-nocookie-net.translate.goog/forzamotorsport/images/c/c9/FH5_Dodge_SRT_Viper_GTS_AE_Large.png',
    class: 'S2',
    isMeta: false,
    tunes: [
      { id: 201, car_id: 2, class: 'S2', creator: 'Nyasmowisher', share_code: '552 608 888', types: ['handling', 'allround'] }
    ]
  },

  // ================= S1 CLASS =================
  {
    id: 3,
    name: "Dodge Viper '13 Anniversary Edition",
    image_url: 'https://static-wikia-nocookie-net.translate.goog/forzamotorsport/images/c/c9/FH5_Dodge_SRT_Viper_GTS_AE_Large.png',
    class: 'S1',
    isMeta: true,
    tunes: [
      { id: 301, car_id: 3, class: 'S1', creator: 'Noa Miyako', share_code: '136 157 717', types: ['handling'], notes: 'rwd drift tyres' },
      { id: 302, car_id: 3, class: 'S1', creator: 'Nalak28', share_code: '109 871 074', types: ['handling'] },
      { id: 303, car_id: 3, class: 'S1', creator: 'FriedRicePro', share_code: '164 651 768', types: ['allround'], notes: 'Drag tyres, but OP' },
      { id: 304, car_id: 3, class: 'S1', creator: 'Rocklxd', share_code: '740 429 138', types: ['dirt handling'] }
    ]
  },
  {
    id: 4,
    name: 'Donkervoort D8 GTO',
    image_url: 'https://static-wikia-nocookie-net.translate.goog/forzamotorsport/images/c/c9/FH5_Dodge_SRT_Viper_GTS_AE_Large.png',
    class: 'S1',
    isMeta: false,
    tunes: [
      { id: 401, car_id: 4, class: 'S1', creator: 'JSR CODCAOS', share_code: '113 618 444', types: ['acceleration'], notes: 'hard to drive!' },
      { id: 402, car_id: 4, class: 'S1', creator: 'Rocklxd', share_code: '550 045 054', types: ['dirt acceleration', 'handling'] }
    ]
  },

  // ================= A CLASS =================
  {
    id: 5,
    name: "BMW M3 '08",
    image_url: 'https://static-wikia-nocookie-net.translate.goog/forzamotorsport/images/c/c9/FH5_Dodge_SRT_Viper_GTS_AE_Large.png',
    class: 'A',
    isMeta: false,
    tunes: [
      { id: 501, car_id: 5, class: 'A', creator: 'NDL Samu', share_code: '438 250 012', types: ['allround'] },
      { id: 502, car_id: 5, class: 'A', creator: 'K1Z Bala', share_code: '509 743 875', types: ['allround'], notes: 'Purist' }
    ]
  },
  {
    id: 6,
    name: "BMW M3 '97",
    image_url: 'https://static-wikia-nocookie-net.translate.goog/forzamotorsport/images/c/c9/FH5_Dodge_SRT_Viper_GTS_AE_Large.png',
    class: 'A',
    isMeta: false,
    tunes: [
      { id: 601, car_id: 6, class: 'A', creator: 'SNO tyui', share_code: '951 145 987', types: ['allround'] }
    ]
  },

  // ================= B CLASS =================
  {
    id: 7,
    name: 'Acura Integra Type-R',
    image_url: 'https://static-wikia-nocookie-net.translate.goog/forzamotorsport/images/c/c9/FH5_Dodge_SRT_Viper_GTS_AE_Large.png',
    class: 'B',
    isMeta: true,
    tunes: [
      { id: 701, car_id: 7, class: 'B', creator: 'diogosilva2004', share_code: '721 518 845', types: ['allround'], notes: 'drag tires' },
      { id: 702, car_id: 7, class: 'B', creator: 'LetzeLu', share_code: '117 054 723', types: ['handling'], notes: 'Handling Purist' },
      { id: 703, car_id: 7, class: 'B', creator: 'KcnaXii', share_code: '143 011 944', types: ['dirt handling', 'allround'], notes: 'pretty easy' }
    ]
  },

  // ================= C CLASS =================
  {
    id: 8,
    name: "Pontiac Firebird Trans Am '77",
    image_url: 'https://static-wikia-nocookie-net.translate.goog/forzamotorsport/images/c/c9/FH5_Dodge_SRT_Viper_GTS_AE_Large.png',
    class: 'C',
    isMeta: false,
    tunes: [
      { id: 801, car_id: 8, class: 'C', creator: 'KilianFireBold', share_code: '960 394 833', types: ['speed'], notes: 'hard to drive!' }
    ]
  },

  // ================= D CLASS =================
  {
    id: 9,
    name: 'Sierra 700R',
    image_url: 'https://static-wikia-nocookie-net.translate.goog/forzamotorsport/images/c/c9/FH5_Dodge_SRT_Viper_GTS_AE_Large.png',
    class: 'D',
    isMeta: false,
    tunes: [
      { id: 901, car_id: 9, class: 'D', creator: 'ShaggyScroll660', share_code: '144 320 206', types: ['handling'] },
      { id: 902, car_id: 9, class: 'D', creator: 'LES Jimka', share_code: '529 948 447', types: ['dirt handling'] }
    ]
  },
  {
    id: 10,
    name: 'VW ID.4',
    image_url: 'https://static-wikia-nocookie-net.translate.goog/forzamotorsport/images/c/c9/FH5_Dodge_SRT_Viper_GTS_AE_Large.png',
    class: 'D',
    isMeta: false,
    tunes: [
      { id: 1001, car_id: 10, class: 'D', creator: 'Zombiejesus52', share_code: '596 283 454', types: ['handling', 'acceleration'], notes: 'tops out at 135 kmh' },
      { id: 1002, car_id: 10, class: 'D', creator: 'Cynamon21', share_code: '136 650 785', types: ['dirt handling', 'acceleration'], notes: 'same goofy stuff' }
    ]
  }
];