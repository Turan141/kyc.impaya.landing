import { atom } from '@reatom/framework';

export const sessionIDAtom = atom<string | null>(null, 'sessionID');
