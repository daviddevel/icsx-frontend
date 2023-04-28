import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { OnlineUserService } from '../../../demo/service/OnlineUserService';
import { DTO } from '../../../types/dto';

const OnlineUsers = () => {
    let emptyOnlineUser: DTO.OnlineUserTable = {
        id: '',
        data: '',
        login: '',
        expired: '',
        duration: ''
    };

    const [onlineusers, setOnlineUsers] = useState<DTO.OnlineUserTable[]>([]);
    const [onlineUserDialog, setOnlineUserDialog] = useState(false);
    const [logoutOnlineUserDialog, setLogoutOnlineUserDialog] = useState(false);
    const [logoutOnlineUsersDialog, setLogoutOnlineUsersDialog] = useState(false);
    const [onlineUser, setOnlineUser] = useState<DTO.OnlineUserTable>(emptyOnlineUser);
    const [selectedOnlineUsers, setSelectedOnlineUsers] = useState<DTO.OnlineUserTable[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<DTO.OnlineUserTable[]>>(null);

    useEffect(() => {
        const onlineUserService = new OnlineUserService();
        onlineUserService.getOnlineUsers().then((data) => setOnlineUsers(data));
    }, []);

    const openNew = () => {
        setOnlineUser(emptyOnlineUser);
        setSubmitted(false);
        setOnlineUserDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setOnlineUserDialog(false);
    };

    const hideLogoutOnlineUserDialog = () => {
        setLogoutOnlineUserDialog(false);
    };

    const logoutOnlineUser = () => {
        let _users = onlineusers.filter((val) => val.id !== onlineUser.id);
        setOnlineUsers(_users);
        setLogoutOnlineUserDialog(false);
        setOnlineUser(emptyOnlineUser);
        toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'User Signed Out', life: 3000 });
    };

    const logoutOnlineUserDialogFooter = (
        <>
        <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideLogoutOnlineUserDialog} />
        <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={logoutOnlineUser} />
    </>
    );

    const hideDeleteUsersDialog = () => {
        setLogoutOnlineUsersDialog(false);
    };

    const confirmSignOutUser = (user: DTO.OnlineUserTable) => {
        setOnlineUser(user);
        setLogoutOnlineUserDialog(true);
    };

    const confirmDeleteSelected = () => {
        setLogoutOnlineUsersDialog(true);
    };

    const deleteSelectedOnlineUsers = () => {
        let _onlineUsers = onlineusers.filter((val) => !selectedOnlineUsers?.includes(val));
        setOnlineUsers(_onlineUsers);
        setLogoutOnlineUsersDialog(false);
        setSelectedOnlineUsers([]);
        toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Online Users Deleted', life: 3000 });
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedOnlineUsers || !selectedOnlineUsers.length} />
                </div>
            </React.Fragment>
        );
    };

    const idBodyTemplate = (rowData: DTO.OnlineUserTable) => {
        return (
            <>
                <span className="p-column-title">Id</span>
                {rowData.id}
            </>
        );
    };

    const dataBodyTemplate = (rowData: DTO.OnlineUserTable) => {
        return (
            <>
                <span className="p-column-title">Data</span>
                {rowData.data}
            </>
        );
    };

    const loginBodyTemplate = (rowData: DTO.OnlineUserTable) => {
        return (
            <>
                <span className="p-column-title">Log In</span>
                {rowData.login}
            </>
        );
    };

    const expiredBodyTemplate = (rowData: DTO.OnlineUserTable) => {
        return (
            <>
                <span className="p-column-title">Expiration</span>
                {rowData.expired}

            </>
        );
    };

    const durationBodyTemplate = (rowData: DTO.OnlineUserTable) => {
        return (
            <>
                <span className="p-column-title">Duration</span>
                {rowData.duration}
            </>
        );
    };

    const actionBodyTemplate = (rowData: DTO.OnlineUserTable) => {
        return (
            <>
                <span className="p-column-title">Action</span>
                <Button label="Sign User Out" icon="pi pi-sign-out" raised severity="warning" className="mr-2" onClick={() => confirmSignOutUser(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage Online Users</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const userDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
        </>
    );

    const logoutUserDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideLogoutOnlineUserDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={logoutOnlineUser} />
        </>
    );
    const logoutUsersDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteUsersDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteSelectedOnlineUsers} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <DataTable
                        ref={dt}
                        value={onlineusers}
                        selection={selectedOnlineUsers}
                        onSelectionChange={(e) => setSelectedOnlineUsers(e.value as DTO.OnlineUserTable[])}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} onlineusers"
                        globalFilter={globalFilter}
                        emptyMessage="No onlineusers found."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '1rem' }}></Column>
                        <Column field="id" header="Id" sortable body={idBodyTemplate} headerStyle={{ minWidth: '2rem' }}></Column>
                        <Column field="data" header="Data" sortable body={dataBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="login" header="Login" sortable body={loginBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="expired" header="Expiration Date" body={expiredBodyTemplate} sortable headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="duration" header="Duration" sortable body={durationBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column header="Action" body={actionBodyTemplate} headerStyle={{ minWidth: '8rem' }}></Column>
                    </DataTable>
                    <Dialog visible={logoutOnlineUserDialog} style={{ width: '450px' }} header="Confirm" modal footer={logoutOnlineUserDialogFooter} onHide={hideLogoutOnlineUserDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {onlineUser && (
                                <span>
                                    Are you sure you want to sign this user out <b>{onlineUser.name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default OnlineUsers;
