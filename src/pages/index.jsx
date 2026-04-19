import { useState } from 'react'
import { Logout } from '../components/Logout'
import { AddLembrete, GetLembrete, GetCalendarLembretes } from '../components/Lembrete'

export function Home() {
    return (
        <>
            <section className='Header'>
                <div className="grid grid-cols-2">
                    <div className="col-span-1 bg-gray-500">
                        <h1>RemindMe</h1>
                    </div>
                    <div className="col-span-1">
                        <p>MENU</p>
                    </div>
                </div>
            </section>
            <Logout />
            <AddLembrete />
            {/*
            <GetLembrete idLembrete={1}/>
            */}
            <GetCalendarLembretes />

        </>
    )
}