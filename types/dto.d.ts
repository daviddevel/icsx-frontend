/* FullCalendar Types */
import { EventApi, EventInput } from '@fullcalendar/core';

/* Chart.js Types */
import { ChartData, ChartOptions } from 'chart.js';

type UserRole = 'Users' | 'Administrators' | 'Investors' | 'Managers' ; 
type InventoryStatus = 'INSTOCK' | 'LOWSTOCK' | 'OUTOFSTOCK';

type Status = 'DELIVERED' | 'PENDING' | 'RETURNED' | 'CANCELLED';

export type LayoutType = 'list' | 'grid';
export type SortOrderType = 1 | 0 | -1;

export interface CustomEvent {
    name?: string;
    status?: 'Ordered' | 'Processing' | 'Shipped' | 'Delivered';
    date?: string;
    color?: string;
    icon?: string;
    image?: string;
}

interface ShowOptions {
    severity?: string;
    content?: string;
    summary?: string;
    detail?: string;
    life?: number;
}

export interface ChartDataState {
    barData?: ChartData;
    pieData?: ChartData;
    lineData?: ChartData;
    polarData?: ChartData;
    radarData?: ChartData;
}
export interface ChartOptionsState {
    barOptions?: ChartOptions;
    pieOptions?: ChartOptions;
    lineOptions?: ChartOptions;
    polarOptions?: ChartOptions;
    radarOptions?: ChartOptions;
}

export interface AppMailProps {
    mails: Demo.Mail[];
}

export interface AppMailSidebarItem {
    label: string;
    icon: string;
    to?: string;
    badge?: number;
    badgeValue?: number;
}

export interface AppMailReplyProps {
    content: Demo.Mail | null;
    hide: () => void;
}

declare namespace DTO {
    interface Task {
        id?: number;
        name?: string;
        description?: string;
        completed?: boolean;
        status?: string;
        comments?: string;
        attachments?: string;
        members?: Member[];
        startDate?: string;
        endDate?: string;
    }

    interface Member {
        name: string;
        image: string;
    }

    interface DialogConfig {
        visible: boolean;
        header: string;
        newTask: boolean;
    }

    interface Mail {
        id: number;
        from: string;
        to: string;
        email: string;
        image: string;
        title: string;
        message: string;
        date: string;
        important: boolean;
        starred: boolean;
        trash: boolean;
        spam: boolean;
        archived: boolean;
        sent: boolean;
    }

    interface User {
        id: number;
        name: string;
        image: string;
        status: string;
        messages: Message[];
        lastSeen: string;
    }

    interface Message {
        text: string;
        ownerId: number;
        createdAt: number;
    }

    //UserService
    type UserTable = {
        id: number;
        username: string;
        investor: string;
        name: string;
        email: string;
        phone: string;
        password: string;
        dd_yn: boolean;
        dd_company: string;
        dd_branch: string;
        dd_user_type: string;
        dd_address: string;
        firm: string;
        role: UserRole;
        activated: string;
        expired: string;
        [key: string]: string | string[] | number | boolean | undefined | UserRole;
    };

    //GroupService
    type GroupTable = {
        id: number;
        name: string;
        role: string;
        created?: string;
        modified?: string;
        [key: string]: string | string[] | number | boolean | undefined | UserRole;
    };


    type CalendarTable = {
        id: number;
        date: string;
        status: number;
        comment: string;
        [key: string]: string | string[] | number | boolean | undefined ;
    };

    //OnlineUserService
    type OnlineUserTable = {
        id?: string;
        data: string;
        login: string;
        expired: string;
        duration?: string;
        [key: string]: string | string[] | number | boolean | undefined | UserRole;
    };

    //FirmService
    type FirmTable = {
        id: number;
        code: string;
        abbr: string;
        name: string;
        email: string;
        phone: string;
        address: string;
        logo: string;
        created?: string;
        modified?: string;
        [key: string]: string | string[] | number | boolean | undefined;
    };

    //IssueService
    type IssuesTable = {
        id: number;
        icode: string;
        iname: string;
        inameAbbrev: string;
        inameEnglish: string;
        inameEnglishAbbrev: string
        created?: string;
        [key: string]: string | string[] | number | undefined;
    };

    //AdvertisementService
    type AdvertisementTable = {
        id?: string;
        company: string;
        website?: string;
        Email: string;
        phone: string;
        photo: string
        description: string;
        release: string;
        expire: string;
        activated: number;
        [key: string]: string | string[] | boolean | number | undefined;
    };


    //ProductService
    type Product = {
        id?: string;
        code?: string;
        name: string;
        description: string;
        image?: string;
        price?: number;
        category?: string;
        quantity?: number;
        inventoryStatus?: InventoryStatus;
        rating?: number;
        orders?: ProductOrder[];
        [key: string]: string | string[] | number | boolean | undefined | ProductOrder[] | InventoryStatus;
    };

    type ProductOrder = {
        id?: string;
        productCode?: string;
        date?: string;
        amount?: number;
        quantity?: number;
        customer?: string;
        status?: Status;
    };

    type Payment = {
        name: string;
        amount: number;
        paid: boolean;
        date: string;
    };

    //CustomerService
    type Customer = {
        id?: number;
        name?: string;
        country?: ICountryObject;
        company?: string;
        date: Date;
        status?: string;
        activity?: number;
        balance?: number | string;
        verified?: boolean;
        amount?: number;
        price?: number;
        rating?: number;
        image?: string;
        orders?: Demo.Customer[];
        inventoryStatus?: string;
        representative: {
            name: string;
            image: string;
        };
    };

    interface Event extends EventInput {
        location?: string;
        description?: string;
        tag?: {
            name: string;
            color: string;
        };
    }

    // PhotoService
    type Photo = {
        title: string;
        itemImageSrc?: string | undefined;
        thumbnailImageSrc?: string | undefined;
        alt?: string | undefined;
    };

    type Country = {
        name: string;
        code: string;
    };

    // IconService
    type Icon = {
        icon?: {
            paths?: string[];
            attrs?: [{}];
            isMulticolor?: boolean;
            isMulticolor2?: boolean;
            grid?: number;
            tags?: string[];
        };
        attrs?: [{}];
        properties?: {
            order?: number;
            id: number;
            name: string;
            prevSize?: number;
            code?: number;
        };
        setIdx?: number;
        setId?: number;
        iconIdx?: number;
    };
}
