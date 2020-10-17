export interface User {
    uid: string
    name: string
    displayName: string
    cipherCount: number
    pointsCount: number
    cipherData: object
    email: string
    firstName: string
    lastName: string
    profilePicture: Picture;
    phone: string
}

interface CipherData {
    solved: boolean
    tried: number
}

export interface Cipher {
    id: string;
    points: number;
    title: string;
    text: string;
    authorId: string;
    source: string;
}
  
export interface Answer {
    id: string;
    result: string;
}

export interface AuthPayload {
    token: string;
    user: User;
}

export interface Picture {
    path: string;
}

