export interface User {
    id:string
    pseudo:string
    email:string
    isAdmin:boolean
}

export interface registerForm{
    email:string
    pseudo:string
    motDePasse:string
    photoProfilPath?:string
    photoBannierePath?:string
}

export interface loginForm{
    email:string
    motDePasse:string
}

export interface userSearch{
    id:string
    pseudo:string
}
