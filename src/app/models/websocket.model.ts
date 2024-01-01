export interface requestMessage {
    action: "sendMessage" | "getAllMessages" | "getAllConnections" | "deleteChat";
    groupId?: string;
    name?: string;
    message?: string
}

export interface responseMessage {
    connectionId?: string;
    message?: string;
    timeStamp?: number;
    name?: string;
    groupId?: string;
    isConnectionLeft?: boolean;
}