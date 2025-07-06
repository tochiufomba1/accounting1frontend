'use client'
import { User } from "@/app/lib/definitions"
import { useTemplate } from "@/app/lib/useTemplate";
import Button from "../components/button/button";


export default function PersonalTemplateForm({ user }: { user: User }) {
    const { templates, isLoading, isError } = useTemplate(user.id)


    // const removeTemplate = async(templateID:number) => {
    //     const request = await fetch(`/api/user/${id}/templates/remove`)
    //     //const result = await request.json()
    //     if (request.ok){
    //         mutate('/api/templates')
    //     }
    // } 

    if (isLoading) {
        return <p>Loading your templates...</p>
    }

    if (isError) {
        return <p>Failed to fetch your data...</p>
    }

    return (
        <div style={{ overflowY: 'auto', maxHeight:'33vh' }}>
            <table style={{ tableLayout: 'fixed', width: '100%' }}>
                <tbody>
                    {templates.map((template, index) => (
                        <tr key={index}>
                            <td style={{ width: '100%' }}>
                                <div style={{display:'flex', alignItems:'center', width: '100%', justifyContent:'space-between'}}>
                                    <h3 style={{ color: 'black', margin:0 }}>{template.title}</h3>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <Button>Publish</Button>
                                        <Button>Delete</Button>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
