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
import { FirmService } from '../../../src/services/FirmService';
import {BASE_URL_API} from '../../../src/services/API';
import { DTO } from '../../../types/dto';
import getConfig from 'next/config';

const Firms = () => {
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    let emptyFirm: DTO.FirmTable = {
        id: 0,
        code: '',
        abbr: '',
        name: '',
        email: '',
        phone: '',
        address: '',
        logo: '',
        created: '',
        modified: ''
    };

    const [firms, setFirms] = useState<DTO.FirmTable[]>([]);
    const [firmDialog, setFirmDialog] = useState(false);
    const [deleteFirmDialog, setDeleteFirmDialog] = useState(false);
    const [deleteFirmsDialog, setDeleteFirmsDialog] = useState(false);
    const [firm, setFirm] = useState<DTO.FirmTable>(emptyFirm);
    const [selectedFirms, setSelectedFirms] = useState<DTO.FirmTable[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<DTO.FirmTable[]>>(null);
    const firmService = new FirmService(BASE_URL_API);

    useEffect(() => {
        firmService.getFirms().then((data) => setFirms(data));
    }, []);

    const openNew = () => {
        setFirm(emptyFirm);
        setSubmitted(false);
        setFirmDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setFirmDialog(false);
    };

    const hideDeleteFirmDialog = () => {
        setDeleteFirmDialog(false);
    };

    const hideDeleteFirmsDialog = () => {
        setDeleteFirmsDialog(false);
    };

    const saveFirm = () => {
        setSubmitted(true);

        if (firm.name.trim()) {
            let _firms = [...firms];
            let _firm = { ...firm };
            if (firm.id) {
                const index = findIndexById(firm.id);
                firmService.updateFirm(_firm.id, _firm.code, _firm.abbr, _firm.name, _firm.email, _firm.phone, _firm.address, _firm.logo)
                
                _firms[index] = _firm;
                toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Firm Updated', life: 3000 });
            } else {
                _firms.push(_firm);
                firmService.createFirm(_firm.code, _firm.abbr, _firm.name, _firm.email, _firm.phone, _firm.address, _firm.logo);               
                toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Firm Created', life: 3000 });
            }

            setFirms(_firms);
            setFirmDialog(false);
            setFirm(emptyFirm);
        }
    };

    const editFirm = (firm: DTO.FirmTable) => {
        setFirm({ ...firm });
        setFirmDialog(true);
    };

    const confirmDeleteFirm = (firm: DTO.FirmTable) => {
        setFirm(firm);
        setDeleteFirmDialog(true);
    };

    const deleteFirm = () => {
        let _firms = firms.filter((val) => val.id !== firm.id);
        setFirms(_firms);
        setDeleteFirmDialog(false);
        setFirm(emptyFirm);
        toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Firm Deleted', life: 3000 });
    };

    const findIndexById = (id: number) => {
        let index = -1;
        for (let i = 0; i < firms.length; i++) {
            if (firms[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const createId = () => {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteFirmsDialog(true);
    };

    const deleteSelectedFirms = () => {
        let _firms = firms.filter((val) => !selectedFirms?.includes(val));
        setFirms(_firms);
        setDeleteFirmsDialog(false);
        setSelectedFirms([]);
        toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Firms Deleted', life: 3000 });
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _firm = { ...firm };
        _firm[`${name}`] = val;

        setFirm(_firm);
    };

    const onUpload = () => {
        toast.current?.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedFirms || !selectedFirms.length} />
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

    const idBodyTemplate = (rowData: DTO.FirmTable) => {
        return (
            <>
                <span className="p-column-title">Id</span>
                {rowData.id}
            </>
        );
    };

    const codeBodyTemplate = (rowData: DTO.FirmTable) => {
        return (
            <>
                <span className="p-column-title">Code</span>
                {rowData.code}
            </>
        );
    };

    const abbrBodyTemplate = (rowData: DTO.FirmTable) => {
        return (
            <>
                <span className="p-column-title">Abbr</span>
                {rowData.abbr}
            </>
        );
    };

    const nameBodyTemplate = (rowData: DTO.FirmTable) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {rowData.name}

            </>
        );
    };

    const emailBodyTemplate = (rowData: DTO.FirmTable) => {
        return (
            <>
                <span className="p-column-title">Email</span>
                {rowData.email}
            </>
        );
    };

    const phoneBodyTemplate = (rowData: DTO.FirmTable) => {
        return (
            <>
                <span className="p-column-title">Phone</span>
                {rowData.phone}
            </>
        );
    };

    const addressBodyTemplate = (rowData: DTO.FirmTable) => {
        return (
            <>
                <span className="p-column-title">Address</span>
                {rowData.address}
            </>
        );
    };

    const createdBodyTemplate = (rowData: DTO.FirmTable) => {
        return (
            <>
                <span className="p-column-title">Created</span>
                {rowData.created}
            </>
        );
    };

    const modifiedBodyTemplate = (rowData: DTO.FirmTable) => {
        return (
            <>
                <span className="p-column-title">Modified</span>
                {rowData.modified}
            </>
        );
    };

    const actionBodyTemplate = (rowData: DTO.FirmTable) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editFirm(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteFirm(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage Firms</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const firmDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-save" className="p-button-text" onClick={saveFirm} />
        </>
    );

    const deleteFirmDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteFirmDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteFirm} />
        </>
    );
    const deleteFirmsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteFirmsDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteSelectedFirms} />
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
                        value={firms}
                        selection={selectedFirms}
                        onSelectionChange={(e) => setSelectedFirms(e.value as DTO.FirmTable[])}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} firms"
                        globalFilter={globalFilter}
                        emptyMessage="No firms found."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '1rem' }}></Column>
                        <Column field="id" header="Id" sortable body={idBodyTemplate} headerStyle={{ minWidth: '2rem' }}></Column>
                        <Column field="code" header="Code" sortable body={codeBodyTemplate} headerStyle={{ minWidth: '8rem' }}></Column>
                        <Column field="abbr" header="Abbr" sortable body={abbrBodyTemplate} headerStyle={{ minWidth: '8rem' }}></Column>
                        <Column field="name" header="Name" body={nameBodyTemplate} sortable headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="email" header="Email" sortable body={emailBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="phone" header="Phone" body={phoneBodyTemplate} sortable headerStyle={{ minWidth: '8rem' }}></Column>
                        <Column field="address" header="Address" body={addressBodyTemplate} sortable headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="created" header="Created" sortable body={createdBodyTemplate} headerStyle={{ minWidth: '8rem' }}></Column>
                        <Column field="modified" header="Modified" sortable body={modifiedBodyTemplate} headerStyle={{ minWidth: '8rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={firmDialog} style={{ width: '450px' }} header="Firm Details" modal className="p-fluid" footer={firmDialogFooter} onHide={hideDialog}>
                    <div className="formgrid grid">
                        <div className="field col">
                            <label htmlFor="code">Code</label>
                            <InputText id="code" value={firm.code} onChange={(e) => onInputChange(e, 'code')} required autoFocus className={classNames({ 'p-invalid': submitted && !firm.code })} />
                            {submitted && !firm.code && <small className="p-invalid">Code is required.</small>}
                        </div>
                        <div className="field col">
                            <label htmlFor="abbr">Abbr</label>
                            <InputText id="abbr" value={firm.abbr} onChange={(e) => onInputChange(e, 'abbr')} required className={classNames({ 'p-invalid': submitted && !firm.abbr })} />
                            {submitted && !firm.abbr && <small className="p-invalid">Abbr is required.</small>}
                        </div>
                    </div>    
                        <div className="field">
                            <label htmlFor="name">Name</label>
                            <InputText id="name" value={firm.name} onChange={(e) => onInputChange(e, 'name')} required className={classNames({ 'p-invalid': submitted && !firm.name })} />
                            {submitted && !firm.name && <small className="p-invalid">Name is required.</small>}
                        </div>
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="email">Email</label>
                                <InputText id="email" value={firm.email} onChange={(e) => onInputChange(e, 'email')} required className={classNames({ 'p-invalid': submitted && !firm.email })} />
                            </div>
                        </div>
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="phone">Phone</label>
                                <InputText id="phone" value={firm.phone} onChange={(e) => onInputChange(e, 'phone')} required className={classNames({ 'p-invalid': submitted && !firm.phone })} />
                            </div>
                        </div>
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="address">Address</label>
                                <InputText id="address" value={firm.address} onChange={(e) => onInputChange(e, 'address')} required className={classNames({ 'p-invalid': submitted && !firm.address })} />
                            </div>
                        </div>
                        <div className="formgrid grid">
                            <div className="field col">
                                    <label htmlFor="logo">Logo</label>
                                    <FileUpload mode="basic" name="logo" url={`${BASE_URL_API}/upload`} onUpload={onUpload} maxFileSize={50000000} />
                            </div>
                        </div>
                    </Dialog>   
                    <Dialog visible={deleteFirmDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteFirmDialogFooter} onHide={hideDeleteFirmDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {firm && (
                                <span>
                                    Are you sure you want to delete <b>{firm.name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteFirmsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteFirmsDialogFooter} onHide={hideDeleteFirmsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {firm && <span>Are you sure you want to delete the selected firms?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Firms;
