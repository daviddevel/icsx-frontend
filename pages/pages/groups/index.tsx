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
import { DTO } from '../../../types/dto';
import { UserGroupService } from '../../../src/services/UserGroupService';
import {BASE_URL_API} from '../../../src/services/API';

const Groups = () => {

    let emptyGroup: DTO.GroupTable = {
        id: 0,
        name: '',
        role: '',
        created: '',
        modified: '',
    };

    const [groups, setGroups] = useState<DTO.GroupTable[]>([]);
    const [groupDialog, setGroupDialog] = useState(false);
    const [deleteGroupDialog, setDeleteGroupDialog] = useState(false);
    const [deleteGroupsDialog, setDeleteGroupsDialog] = useState(false);
    const [group, setGroup] = useState<DTO.GroupTable>(emptyGroup);
    const [selectedGroups, setSelectedGroups] = useState<DTO.GroupTable[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<DTO.GroupTable[]>>(null);
    const userGroupService = new UserGroupService(BASE_URL_API);
    
    useEffect(() => {
        userGroupService.getUserGroups().then((data) => setGroups(data));
    }, []);

    const openNew = () => {
        setGroup(emptyGroup);
        setSubmitted(false);
        setGroupDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setGroupDialog(false);
    };

    const hideDeleteGroupDialog = () => {
        setDeleteGroupDialog(false);
    };

    const hideDeleteGroupsDialog = () => {
        setDeleteGroupsDialog(false);
    };

    const saveGroup = () => {
        setSubmitted(true);

        if (group.name.trim() && group.role.trim()) {
            let _groups = [...groups];
            let _group = { ...group };
            if (group.id) {
                const index = findIndexById(group.id);
                _groups[index] = _group;
                userGroupService.updateUserGroup(_group.id, _group.name, _group.role)
                toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Group Updated', life: 3000 });
            } else {
                _groups.push(_group);
                userGroupService.createUserGroup(_group.name, _group.role);                
                toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Group Created', life: 3000 });
            }

            setGroups(_groups);
            setGroupDialog(false);
            setGroup(emptyGroup);
        }
    };

    const editGroup = (group: DTO.GroupTable) => {
        setGroup({ ...group });
        setGroupDialog(true);
    };

    const confirmDeleteGroup = (group: DTO.GroupTable) => {
        setGroup(group);
        setDeleteGroupDialog(true);
    };

    const deleteGroup = () => {
        let _groups = groups.filter((val) => val.id !== group.id);
        setGroups(_groups);
        setDeleteGroupDialog(false);
        setGroup(emptyGroup);
        let _group = { ...group };
            const index = findIndexById(group.id);
            _groups[index] = _group;
            userGroupService.deleteUserGroup(_group.id);
            toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Group Deleted', life: 3000 });
    };

    const findIndexById = (id: number) => {
        let index = -1;
        for (let i = 0; i < groups.length; i++) {
            if (groups[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmGroupDeleteSelected = () => {
        setDeleteGroupsDialog(true);
    };

    const deleteSelectedGroups = () => {
        let _groups = groups.filter((val) => !selectedGroups?.includes(val));
        setGroups(_groups);
        setDeleteGroupsDialog(false);
        setSelectedGroups([]);
        toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Groups Deleted', life: 3000 });
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _group = { ...group };
        _group[`${name}`] = val;

        setGroup(_group);
    };

    const onUpload = () => {
        toast.current?.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmGroupDeleteSelected} disabled={!selectedGroups || !selectedGroups.length} />
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

    const idBodyTemplate = (rowData: DTO.GroupTable) => {
        return (
            <>
                <span className="p-column-title">Id</span>
                {rowData.id}
            </>
        );
    };

    const nameBodyTemplate = (rowData: DTO.GroupTable) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {rowData.name}
            </>
        );
    };

    const roleBodyTemplate = (rowData: DTO.GroupTable) => {
        return (
            <>
                <span className="p-column-title">Role</span>
                {rowData.role}
            </>
        );
    };

    const createdBodyTemplate = (rowData: DTO.GroupTable) => {
        return (
            <>
                <span className="p-column-title">Created</span>
                {rowData.created}
            </>
        );
    };

    const modifiedBodyTemplate = (rowData: DTO.GroupTable) => {
        return (
            <>
                <span className="p-column-title">Modified</span>
                {rowData.modified}
            </>
        );
    };

    const actionBodyTemplate = (rowData: DTO.GroupTable) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editGroup(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteGroup(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage Groups</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const groupDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-save" className="p-button-text" onClick={saveGroup} />
        </>
    );

    const deleteGroupDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteGroupDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteGroup} />
        </>
    );
    const deleteGroupsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteGroupsDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteSelectedGroups} />
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
                        value={groups}
                        selection={selectedGroups}
                        onSelectionChange={(e) => setSelectedGroups(e.value as DTO.GroupTable[])}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} groups"
                        globalFilter={globalFilter}
                        emptyMessage="No groups found."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '1rem' }}></Column>
                        <Column field="id" header="Id" sortable body={idBodyTemplate} headerStyle={{ minWidth: '2rem' }}></Column>
                        <Column field="name" header="Name" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="role" header="Role" sortable body={roleBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="created" header="Created" sortable body={createdBodyTemplate} headerStyle={{ minWidth: '8rem' }}></Column>
                        <Column field="modified" header="Modified" sortable body={modifiedBodyTemplate} headerStyle={{ minWidth: '8rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '8rem' }}></Column>
                    </DataTable>

                    <Dialog visible={groupDialog} style={{ width: '450px' }} header="Group Details" modal className="p-fluid" footer={groupDialogFooter} onHide={hideDialog}>
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="name">Group Name</label>
                                <InputText id="name" value={group.name} onChange={(e) => onInputChange(e, 'name')} required className={classNames({ 'p-invalid': submitted && !group.name })} />
                                {submitted && !group.name && <small className="p-invalid">Group name is required.</small>}
                            </div>
                        </div>
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="role">Role Name</label>
                                <InputText id="abbreviationKh" value={group.role} onChange={(e) => onInputChange(e, 'role')} required className={classNames({ 'p-invalid': submitted && !group.role })} />
                                {submitted && !group.role && <small className="p-invalid">Role name is required.</small>}
                            </div>
                        </div>

                    </Dialog>
                    <Dialog visible={deleteGroupDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteGroupDialogFooter} onHide={hideDeleteGroupDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {group && (
                                <span>
                                    Are you sure you want to delete <b>{group.name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteGroupsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteGroupsDialogFooter} onHide={hideDeleteGroupsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {group && <span>Are you sure you want to delete the selected groups?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Groups;
