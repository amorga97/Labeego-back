import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { ifChat } from '../models/chat.model';
import { ifPartialUser } from '../models/user.model';
import { ifTask } from '../models/task.model';

@Injectable()
export class Helpers {
    async createInitialTasks(Task: Model<ifTask>, projectId: string) {
        const initialTasks = [
            {
                title: 'estudio del cliente',
                description:
                    '¿qué desea? ¿con que presupuesto se siente cómodo?',
            },
            {
                title: 'obtención de medidas',
                description: '',
            },
            {
                title: 'guión interno del presupuesto',
                description:
                    'estimación del presupuesto del proyecto a nivel interno',
            },
            {
                title: 'maquetado',
                description: 'generación de renders en sketchUp',
            },
            {
                title: 'propuesta al cliente',
                description:
                    'presentación del proyecto y el presupuesto sujeta a posibles cambios',
            },
            {
                title: 'consolidación',
                description:
                    'la propuesta del proyecto es aprobada por el cliente y se obtiene señal',
            },
        ];
        const insertResult = await Task.insertMany(
            initialTasks.map((item) => ({
                ...item,
                project: projectId,
                status: 'to-do',
            })),
            { rawResult: true },
        );
        const idArray: string[] = [];
        for (let i = 0; i < insertResult.insertedCount; i++) {
            idArray.push(insertResult.insertedIds[i].toString());
        }

        return idArray;
    }

    async createTeamChats(
        Chat: Model<ifChat>,
        teamIds: ifPartialUser[],
        teamLeader: Types.ObjectId,
    ) {
        const chats = [];
        teamIds.forEach(async (item, index) => {
            if (index < teamIds.length - 1) {
                for (let i = index + 1; i < teamIds.length; i++) {
                    chats.push(
                        await Chat.create({
                            users: [{ ...item }, { ...teamIds[i] }],
                            messages: [],
                            teamLeader,
                        }),
                    );
                }
            }
        });
        return chats;
    }
}
