export interface Attachment {
    fileName: string;   
    fileType?: string;     
    filePath?: string;     
    originalFileName: string;
}
export interface Contextblockinterface {
    _id?: string;               
    panelId: string;              
    subPanel?: string;   
    content: string;            
    volunteerAccess: boolean;   
    includeAttachments?: boolean;
    attachments: Attachment[]; 
}
