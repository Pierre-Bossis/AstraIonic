export interface Post {
    id: number
    contenu: string
    jaime: number
    partage: number
    dateCreation: Date
    user_Pseudo: string

    image1: string
    image2: string
    image3: string
    image4: string
}
export interface PostForm {
    contenu: string
    user_pseudo:string
}
