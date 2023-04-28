import { Calendar, CalendarChangeEvent } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { Menu } from 'primereact/menu';
import { Password } from 'primereact/password';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { FirmService } from '../../../src/services/FirmService';
import { UserService } from '../../../src/services/UserService';
import {BASE_URL_API} from '../../../src/services/API';
import { DTO } from '../../../types/dto';

interface InputValue {
    name: string;
    code: string;
}

const Users = () => {
    let emptyUser: DTO.UserTable = {
        id: 0,
        username: '',
        investor: '',
        name: '',
        email: '',
        phone: '',
        password: '',
        firm: '',
        role: 'Users',
        activated: '',
        created: '',
        modified: '',
        expired: '',
        dd_yn: false,
        dd_company: '',
        dd_branch: '',
        dd_user_type: '',
        dd_address: '',
    };

    const [users, setUsers] = useState<DTO.UserTable[]>([]);
    const menu = useRef<Menu>(null);
    const [statusValue, setStatusValue] = useState(null);
    const [screenTypeValue, setScreenTypeValue] = useState(null);
    const [firms, setFirms] = useState<DTO.FirmTable[]>([]);
    const [firm, setFirm] = useState<DTO.UserTable[]>([]);
    const [expired, setExpired] = useState<DTO.UserTable[]>([]);
    const [roleValue, setRoleValue] = useState(null);
    const [userDialog, setUserDialog] = useState(false);
    const [dataDisplayUserDialog, setDataDisplayUserDialog] = useState(false);
    const [deleteUserDialog, setDeleteUserDialog] = useState(false);
    const [deleteUsersDialog, setDeleteUsersDialog] = useState(false);
    const [user, setUser] = useState<DTO.UserTable>(emptyUser);
    const [selectedUsers, setSelectedUsers] = useState<DTO.UserTable[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<DTO.UserTable[]>>(null);
    const userService = new UserService(BASE_URL_API);

    useEffect(() => {
        userService.getUsers().then((data) => setUsers(data));
    }, []);

    useEffect(() => {
        const firmService = new FirmService(BASE_URL_API);
        firmService.getFirms().then((data) => setFirms(data));
    }, []);

    const openFormICSXUser = () => {
        setUser(emptyUser);
        setSubmitted(false);
        setUserDialog(true);
    };

    const openFormDataDisplayUser = () => {
        setUser(emptyUser);
        setSubmitted(false);
        setDataDisplayUserDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setUserDialog(false);
    };

    const hideDataDisplayUserDialog = () => {
        setSubmitted(false);
        setDataDisplayUserDialog(false);
    };

    const hideDeleteUserDialog = () => {
        setDeleteUserDialog(false);
    };

    const hideDeleteUsersDialog = () => {
        setDeleteUsersDialog(false);
    };

    const saveUser = () => {
        setSubmitted(true);

        if (user.name.trim()) {
            let _users = [...users];
            let _user = { ...user };
            if (user.id) {
                const index = findIndexById(user.id);
                _users[index] = _user;
                toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'User Updated', life: 3000 });
            } else {
                _users.push(_user);
                userService.createICSXUser(_user.username, _user.investor, _user.name, _user.email, _user.phone, _user.password, _user.firm, _user.activated, _user.role, _user.expired)
                toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'User Created', life: 3000 });
            }

            setUsers(_users);
            setUserDialog(false);
            setUser(emptyUser);
        }
    };

    const editUser = (user: DTO.UserTable) => {
        setUser({ ...user });
        setUserDialog(true);
    };

    const confirmDeleteUser = (user: DTO.UserTable) => {
        setUser(user);
        setDeleteUserDialog(true);
    };

    const deleteUser = () => {
        let _users = users.filter((val) => val.id !== user.id);
        setUsers(_users);
        setDeleteUserDialog(false);
        setUser(emptyUser);
        toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'User Deleted', life: 3000 });
    };

    const findIndexById = (id: number) => {
        let index = -1;
        for (let i = 0; i < users.length; i++) {
            if (users[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteUsersDialog(true);
    };

    const deleteSelectedProducts = () => {
        let _users = users.filter((val) => !selectedUsers?.includes(val));
        setUsers(_users);
        setDeleteUsersDialog(false);
        setSelectedUsers([]);
        toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Users Deleted', life: 3000 });
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _user = { ...user };
        _user[`${name}`] = val;

        setUser(_user);
    };

    const statusValues: InputValue[] = [
        { name: 'Deactivated', code: '0' },
        { name: 'Activated', code: '1' },
        { name: 'Blocked', code: '2' }
    ];

    const screenTypeValues: InputValue[] = [
        { name: 'All Stock', code: 'AS' },
        { name: 'One Stock', code: 'OS' }
    ];

    const roleValues: InputValue[] = [
        { name: 'Users', code: 'USER' },
        { name: 'Administrators', code: 'ADMIN' },
        { name: 'Managers', code: 'MANAGERS' },
        { name: 'Investors', code: 'INVESTORS' },
        { name: 'Subscribers', code: 'SUBSCRIBERS' }
    ];


    const overlayMenuItems = [
        {
            label: 'ICSX User',
            icon: 'pi pi-user-plus',
            command: () => openFormICSXUser()
        },
        {
            label: 'Data Display User',
            icon: 'pi pi-user-plus',
            command: () => openFormDataDisplayUser()
        }
    ];

    const toggleMenu: React.MouseEventHandler<HTMLButtonElement> | undefined = (event) => {
        menu.current?.toggle(event);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">

                    <Menu ref={menu} model={overlayMenuItems} popup />
                    <Button type="button" label="Create User" icon="pi pi-plus" onClick={toggleMenu} style={{ width: 'auto' }} className="mr-2 inline-block" />
                    <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedUsers || !selectedUsers.length} />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} chooseLabel="Import" className="mr-2 inline-block" />
                <Button label="Export" icon="pi pi-upload" severity="help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const idBodyTemplate = (rowData: DTO.UserTable) => {
        return (
            <>
                <span className="p-column-title">Id</span>
                {rowData.id}
            </>
        );
    };

    const usernameBodyTemplate = (rowData: DTO.UserTable) => {
        return (
            <>
                <span className="p-column-title">Username</span>
                {rowData.username}
            </>
        );
    };

    const investorBodyTemplate = (rowData: DTO.UserTable) => {
        return (
            <>
                <span className="p-column-title">Investor</span>
                {rowData.investor}
            </>
        );
    };

    const nameBodyTemplate = (rowData: DTO.UserTable) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {rowData.name}

            </>
        );
    };

    const firmBodyTemplate = (rowData: DTO.UserTable) => {
        return (
            <>
                <span className="p-column-title">Firm</span>
                {rowData.firm}
            </>
        );
    };

    const roleBodyTemplate = (rowData: DTO.UserTable) => {
        return (
            <>
                <span className="p-column-title">Role</span>
                {rowData.role}
            </>
        );
    };

    const activationBodyTemplate = (rowData: DTO.UserTable) => {
        return (
            <>
                <span className="p-column-title">Activation</span>
                {rowData.activation}
            </>
        );
    };

    const createdBodyTemplate = (rowData: DTO.UserTable) => {
        return (
            <>
                <span className="p-column-title">Created</span>
                {rowData.created}
            </>
        );
    };

    const modifiedBodyTemplate = (rowData: DTO.UserTable) => {
        return (
            <>
                <span className="p-column-title">Modified</span>
                {rowData.modified}
            </>
        );
    };

    const expiredBodyTemplate = (rowData: DTO.UserTable) => {
        return (
            <>
                <span className="p-column-title">Expired</span>
                {rowData.expired}
            </>
        );
    };

    const actionBodyTemplate = (rowData: DTO.UserTable) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editUser(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteUser(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage Users</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const userDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-save" className="p-button-text" onClick={saveUser} />
        </>
    );

    const dataDisplayUserDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDataDisplayUserDialog} />
            <Button label="Save" icon="pi pi-save" className="p-button-text" onClick={saveUser} />
        </>
    );

    const deleteUserDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteUserDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteUser} />
        </>
    );
    const deleteUsersDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteUsersDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteSelectedProducts} />
        </>
    );
    
    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={users}
                        selection={selectedUsers}
                        onSelectionChange={(e) => setSelectedUsers(e.value as DTO.UserTable[])}
                        dataKey="id"
                        paginator
                        rows={25}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} users"
                        globalFilter={globalFilter}
                        emptyMessage="No users found."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '1rem' }}></Column>
                        <Column field="id" header="Id" sortable body={idBodyTemplate} headerStyle={{ minWidth: '2rem' }}></Column>
                        <Column field="username" header="Username" sortable body={usernameBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="investor" header="Investor" sortable body={investorBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="name" header="Name" body={nameBodyTemplate} sortable headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="firm" header="Firm" sortable body={firmBodyTemplate} headerStyle={{ minWidth: '6rem' }}></Column>
                        <Column field="role" header="Role" body={roleBodyTemplate} sortable headerStyle={{ minWidth: '8rem' }}></Column>
                        <Column field="activation" header="Activation" body={activationBodyTemplate} sortable headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="created" header="Created" sortable body={createdBodyTemplate} headerStyle={{ minWidth: '8rem' }}></Column>
                        <Column field="modified" header="Modified" sortable body={modifiedBodyTemplate} headerStyle={{ minWidth: '8rem' }}></Column>
                        <Column field="expired" header="Expired" sortable body={expiredBodyTemplate} headerStyle={{ minWidth: '8rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '12rem' }}></Column>
                    </DataTable>

                    <Dialog visible={userDialog} style={{ width: '450px' }} header="ICSX User Details" modal className="p-fluid" footer={userDialogFooter} onHide={hideDialog}>
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="username">Username</label>
                                <InputText id="username" value={user.username} onChange={(e) => onInputChange(e, 'username')} required className={classNames({ 'p-invalid': submitted && !user.username })} />
                                {submitted && !user.username && <small className="p-invalid">Username is required.</small>}
                            </div>
                            <div className="field col">
                                <label htmlFor="investor">Investor ID</label>
                                <InputText id="investor" value={user.investor} onChange={(e) => onInputChange(e, 'investor')} required className={classNames({ 'p-invalid': submitted && !user.investor })} />
                                {submitted && !user.investor && <small className="p-invalid">Investor is required.</small>}
                            </div>
                        </div>
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="name">Name</label>
                                <InputText id="name" value={user.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !user.name })} />
                                {submitted && !user.name && <small className="p-invalid">Name is required.</small>}
                            </div>
                            <div className="field col">
                                <label htmlFor="email">Email</label>
                                <InputText id="email" value={user.email} onChange={(e) => onInputChange(e, 'email')} required autoFocus className={classNames({ 'p-invalid': submitted && !user.email })} />
                                {submitted && !user.email && <small className="p-invalid">Email is required.</small>}
                            </div>
                        </div>
                        <div className="field">
                            <label htmlFor="phone">Phone</label>
                            <InputText id="phone" value={user.phone} onChange={(e) => onInputChange(e, 'phone')} autoFocus />
                            {submitted}
                        </div>
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="password1">Password</label>
                                <Password toggleMask value={user.password} onChange={(e) => onInputChange(e, 'password')} promptLabel="Choose a password" weakLabel="Too simple" mediumLabel="Average complexity" strongLabel="Complex password" required autoFocus className={classNames({ 'p-invalid': submitted && !user.name })} />
                                {submitted && !user.password && <small className="p-invalid">Password is required.</small>}
                            </div>
                            <div className="field col">
                                <label htmlFor="password2">Confirm Password</label>
                                <Password toggleMask value={user.password} onChange={(e) => onInputChange(e, 'password')} promptLabel="Choose a password" weakLabel="Too simple" mediumLabel="Average complexity" strongLabel="Complex password" required autoFocus className={classNames({ 'p-invalid': submitted && !user.name })} />
                                {submitted && !user.password && <small className="p-invalid">Password is required.</small>}
                            </div>
                        </div>
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="firm">Firm</label>
                                <Dropdown value={firm} onChange={(e) => setFirm(e.value)} options={firms} optionLabel="name" placeholder="Select" />
                            </div>
                        </div>

                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="activated">Status</label>
                                <Dropdown value={statusValue} onChange={(e) => setStatusValue(e.value)} options={statusValues} optionLabel="name" placeholder="Select" />
                            </div>
                        </div>
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="group">User Group</label>
                                <Dropdown value={roleValue} onChange={(e) => setRoleValue(e.value)} options={roleValues} optionLabel="name" placeholder="Select" />
                            </div>
                        </div>
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="expired">Expiry Date</label>
                                <Calendar id="expired" dateFormat="dd/mm/yy" value={user.expired} onChange={(e) => (e.value)} showIcon showButtonBar />
                            </div>
                        </div>
                    </Dialog>

                    <Dialog visible={dataDisplayUserDialog} style={{ width: '450px' }} header="Data Display User Details" modal className="p-fluid" footer={dataDisplayUserDialogFooter} onHide={hideDataDisplayUserDialog}>
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="username">Username</label>
                                <InputText id="username" value={user.username} onChange={(e) => onInputChange(e, 'username')} required className={classNames({ 'p-invalid': submitted && !user.username })} />
                                {submitted && !user.username && <small className="p-invalid">Username is required.</small>}
                            </div>
                            <div className="field col">
                                <label htmlFor="firm">Firm</label>
                                <Dropdown value={firm} onChange={(e) => setFirm(e.value)} options={firms} optionLabel="name" placeholder="Select" />
                            </div>
                        </div>
                        <div className="field">
                            <label htmlFor="dd_branch">Head Office/Branch</label>
                            <Dropdown value={firm} onChange={(e) => setFirm(e.value)} options={firms} optionLabel="name" placeholder="Select" />
                        </div>

                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="dd_address">Address</label>
                                <InputText id="dd_address" value={user.dd_address} onChange={(e) => onInputChange(e, 'dd_address')} required autoFocus className={classNames({ 'p-invalid': submitted && !user.dd_address })} />
                                {submitted && !user.dd_address && <small className="p-invalid">Address is required.</small>}
                            </div>
                        </div>
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="email">Email</label>
                                <InputText id="email" value={user.email} onChange={(e) => onInputChange(e, 'email')} required autoFocus className={classNames({ 'p-invalid': submitted && !user.email })} />
                                {submitted && !user.email && <small className="p-invalid">Email is required.</small>}
                            </div>

                            <div className="field col">
                                <label htmlFor="phone">Phone</label>
                                <InputText id="phone" value={user.phone} onChange={(e) => onInputChange(e, 'phone')} autoFocus />
                                {submitted}
                            </div>
                        </div>
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="dd_user_type">User Type</label>
                                <Dropdown value={firm} onChange={(e) => setFirm(e.value)} options={firms} optionLabel="name" placeholder="Select" />
                            </div>
                            <div className="field col">
                                    <label htmlFor="activated">Screen Type</label>
                                    <Dropdown value={screenTypeValue} onChange={(e) => setScreenTypeValue(e.value)} options={screenTypeValues} optionLabel="name" placeholder="Select" />
                            </div>
                        </div>
                        <div className="formgrid grid">
                        <div className="field col">
                                <label htmlFor="firm">Stock Name</label>
                                <Dropdown value={firm} onChange={(e) => setFirm(e.value)} options={firms} optionLabel="name" placeholder="Select" />
                            </div>
                        </div>
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="password1">Password</label>
                                <Password toggleMask value={user.password} onChange={(e) => onInputChange(e, 'password')} promptLabel="Choose a password" weakLabel="Too simple" mediumLabel="Average complexity" strongLabel="Complex password" required autoFocus className={classNames({ 'p-invalid': submitted && !user.name })} />
                                {submitted && !user.password && <small className="p-invalid">Password is required.</small>}
                            </div>
                            <div className="field col">
                                <label htmlFor="password2">Confirm Password</label>
                                <Password toggleMask value={user.password} onChange={(e) => onInputChange(e, 'password')} promptLabel="Choose a password" weakLabel="Too simple" mediumLabel="Average complexity" strongLabel="Complex password" required autoFocus className={classNames({ 'p-invalid': submitted && !user.name })} />
                                {submitted && !user.password && <small className="p-invalid">Password is required.</small>}
                            </div>
                        </div>

                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="activated">Status</label>
                                <Dropdown value={statusValue} onChange={(e) => setStatusValue(e.value)} options={statusValues} optionLabel="name" placeholder="Select" />
                            </div>
                        </div>
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="expired">Expiry Date</label>
                                <Calendar id="expired" dateFormat="dd/mm/yy" showIcon showButtonBar value={user.expired} onChange={(e) => (e.value as Date, 'expired')}></Calendar>
                            </div>
                        </div>
                    </Dialog>
                    <Dialog visible={deleteUserDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteUserDialogFooter} onHide={hideDeleteUserDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {user && (
                                <span>
                                    Are you sure you want to delete <b>{user.name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>
                    <Dialog visible={deleteUsersDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteUsersDialogFooter} onHide={hideDeleteUsersDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {user && <span>Are you sure you want to delete the selected users?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Users;
