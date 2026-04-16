import { useState } from 'react'
import { Logout } from '../components/Logout'
import { AddLembrete } from '../components/Lembrete'

export function Home() {
    return (
        <>
            <h1>Hello World</h1>
            <Logout />
            <AddLembrete />
        </>
    )
}