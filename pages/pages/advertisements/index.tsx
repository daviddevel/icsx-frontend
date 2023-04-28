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
import { AdvertisementService } from '../../../src/services/AdvertisementService';
import { BASE_URL_API } from '../../../src/services/API';
import { DTO } from '../../../types/dto';
import getConfig from 'next/config';
import { InputSwitch } from 'primereact/inputswitch';
import { Calendar } from 'primereact/calendar';

const Advertisements = () => {
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    let emptyAdvertisement: DTO.AdvertisementTable = {
        id: '',
        company: '',
        website: '',
        Email: '',
        phone: '',
        photo: '',
        description: '',
        release: '', 
        expire: '',
        activated: 1,
    };

    const [advertisements, setAdvertisements] = useState<DTO.AdvertisementTable[]>([]);
    const [advertisementDialog, setAdvertisementDialog] = useState(false);
    const [deleteAdvertisementDialog, setDeleteAdvertisementDialog] = useState(false);
    const [deleteAdvertisementsDialog, setDeleteAdvertisementsDialog] = useState(false);
    const [advertisement, setAdvertisement] = useState<DTO.AdvertisementTable>(emptyAdvertisement);
    const [selectedAdvertisements, setSelectedAdvertisements] = useState<DTO.AdvertisementTable[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [switchValue, setSwitchValue] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<DTO.AdvertisementTable[]>>(null);
    const advertisementService = new AdvertisementService(BASE_URL_API);


    useEffect(() => {
        advertisementService.getAdvertisements().then((data) => setAdvertisements(data));
    }, []);

    const openNew = () => {
        setAdvertisement(emptyAdvertisement);
        setSubmitted(false);
        setAdvertisementDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setAdvertisementDialog(false);
    };

    const hideDeleteAdvertisementDialog = () => {
        setDeleteAdvertisementDialog(false);
    };

    const hideDeleteAdvertisementsDialog = () => {
        setDeleteAdvertisementsDialog(false);
    };

    const saveAdvertisement = () => {
        setSubmitted(true);

        if (advertisement.company.trim()) {
            let _advertisements = [...advertisements];
            let _advertisement = { ...advertisement };
            if (advertisement.id) {
                const index = findIndexById(advertisement.id);

                _advertisements[index] = _advertisement;
                toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Advertisement Updated', life: 3000 });
            } else {
                _advertisements.push(_advertisement);
                advertisementService.createAdvertisement(
                    _advertisement.company, 
                    _advertisement.website, 
                    _advertisement.Email, 
                    _advertisement.phone, 
                    _advertisement.photo, 
                    _advertisement.description, 
                    _advertisement.release, 
                    _advertisement.expire, 
                    _advertisement.activated);
                toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Advertisement Created', life: 3000 });
            }

            setAdvertisements(_advertisements);
            setAdvertisementDialog(false);
            setAdvertisement(emptyAdvertisement);
        }
    };

    const editAdvertisement = (advertisement: DTO.AdvertisementTable) => {
        setAdvertisement({ ...advertisement });
        setAdvertisementDialog(true);
    };

    const confirmDeleteAdvertisement = (advertisement: DTO.AdvertisementTable) => {
        setAdvertisement(advertisement);
        setDeleteAdvertisementDialog(true);
    };

    const deleteAdvertisement = () => {
        let _advertisements = advertisements.filter((val) => val.id !== advertisement.id);
        setAdvertisements(_advertisements);
        setDeleteAdvertisementDialog(false);
        setAdvertisement(emptyAdvertisement);
        toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Advertisement Deleted', life: 3000 });
    };

    const findIndexById = (id: string) => {
        let index = -1;
        for (let i = 0; i < advertisements.length; i++) {
            if (advertisements[i].id === id) {
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
        setDeleteAdvertisementsDialog(true);
    };

    const deleteSelectedAdvertisements = () => {
        let _advertisements = advertisements.filter((val) => !selectedAdvertisements?.includes(val));
        setAdvertisements(_advertisements);
        setDeleteAdvertisementsDialog(false);
        setSelectedAdvertisements([]);
        toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Advertisements Deleted', life: 3000 });
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _advertisement = { ...advertisement };
        _advertisement[`${name}`] = val;

        setAdvertisement(_advertisement);
    };

    const onUpload = () => {
        toast.current?.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedAdvertisements || !selectedAdvertisements.length} />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" accept="image/*" maxFileSize={40000000} chooseLabel="Import" className="mr-2 inline-block" />
                <Button label="Export" icon="pi pi-upload" severity="help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const idBodyTemplate = (rowData: DTO.AdvertisementTable) => {
        return (
            <>
                <span className="p-column-title">Id</span>
                {rowData.id}
            </>
        );
    };

    const companyBodyTemplate = (rowData: DTO.AdvertisementTable) => {
        return (
            <>
                <span className="p-column-title">Company</span>
                {rowData.company}
            </>
        );
    };

    const websiteBodyTemplate = (rowData: DTO.AdvertisementTable) => {
        return (
            <>
                <span className="p-column-title">Website</span>
                {rowData.website}
            </>
        );
    };

    const emailBodyTemplate = (rowData: DTO.AdvertisementTable) => {
        return (
            <>
                <span className="p-column-title">Email</span>
                {rowData.Email}

            </>
        );
    };

    const phoneBodyTemplate = (rowData: DTO.AdvertisementTable) => {
        return (
            <>
                <span className="p-column-title">Phone</span>
                {rowData.phone}
            </>
        );
    };

    const photoBodyTemplate = (rowData: DTO.AdvertisementTable) => {
        return (
            <>
                <span className="p-column-title">Photo</span>
                {rowData.photo}
            </>
        );
    };

    const descriptionBodyTemplate = (rowData: DTO.AdvertisementTable) => {
        return (
            <>
                <span className="p-column-title">Description</span>
                {rowData.description}
            </>
        );
    };

    const releaseDateBodyTemplate = (rowData: DTO.AdvertisementTable) => {
        return (
            <>
                <span className="p-column-title">Released Date</span>
                {rowData.release}
            </>
        );
    };

    const expiredBodyTemplate = (rowData: DTO.AdvertisementTable) => {
        return (
            <>
                <span className="p-column-title">Expired</span>
                {rowData.expire}
            </>
        );
    };

    const activatedBodyTemplate = (rowData: DTO.AdvertisementTable) => {
        return (
            <>
                <span className="p-column-title">Activated</span>
                {rowData.activated}
            </>
        );
    };

    const createdBodyTemplate = (rowData: DTO.AdvertisementTable) => {
        return (
            <>
                <span className="p-column-title">Created</span>
                {rowData.created}
            </>
        );
    };

    const modifiedBodyTemplate = (rowData: DTO.AdvertisementTable) => {
        return (
            <>
                <span className="p-column-title">Modified</span>
                {rowData.modified}
            </>
        );
    };

    const actionBodyTemplate = (rowData: DTO.AdvertisementTable) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editAdvertisement(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteAdvertisement(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage Advertisements</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const advertisementDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-save" className="p-button-text" onClick={saveAdvertisement} />
        </>
    );

    const deleteAdvertisementDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteAdvertisementDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteAdvertisement} />
        </>
    );
    const deleteAdvertisementsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteAdvertisementsDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteSelectedAdvertisements} />
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
                        value={advertisements}
                        selection={selectedAdvertisements}
                        onSelectionChange={(e) => setSelectedAdvertisements(e.value as DTO.AdvertisementTable[])}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} advertisements"
                        globalFilter={globalFilter}
                        emptyMessage="No advertisements found."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '1rem' }}></Column>
                        <Column field="id" header="Id" sortable body={idBodyTemplate} headerStyle={{ minWidth: '2rem' }}></Column>
                        <Column field="company" header="Company" sortable body={companyBodyTemplate} headerStyle={{ minWidth: '8rem' }}></Column>
                        <Column field="website" header="Website" sortable body={websiteBodyTemplate} headerStyle={{ minWidth: '8rem' }}></Column>
                        <Column field="photo" header="Photo" body={photoBodyTemplate} sortable headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="description" header="Description" sortable body={descriptionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="Email" header="Email" body={emailBodyTemplate} sortable headerStyle={{ minWidth: '8rem' }}></Column>
                        <Column field="phone" header="Phone" body={phoneBodyTemplate} sortable headerStyle={{ minWidth: '8rem' }}></Column>
                        <Column field="releaseDate" header="Release" sortable body={releaseDateBodyTemplate} headerStyle={{ minWidth: '8rem' }}></Column>
                        <Column field="expire" header="Expired" sortable body={expiredBodyTemplate} headerStyle={{ minWidth: '8rem' }}></Column>
                        <Column field="activated" header="Activated" sortable body={activatedBodyTemplate} headerStyle={{ minWidth: '8rem' }}></Column>
                        <Column field="created" header="Created" sortable body={createdBodyTemplate} headerStyle={{ minWidth: '8rem' }}></Column>
                        <Column field="modified" header="Modified" sortable body={modifiedBodyTemplate} headerStyle={{ minWidth: '8rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={advertisementDialog} style={{ width: '450px' }} header="Advertisement Details" modal className="p-fluid" footer={advertisementDialogFooter} onHide={hideDialog}>
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="company">Company</label>
                                <InputText id="company" value={advertisement.company} onChange={(e) => onInputChange(e, 'company')} required autoFocus className={classNames({ 'p-invalid': submitted && !advertisement.company })} />
                                {submitted && !advertisement.company && <small className="p-invalid">Company is required.</small>}
                            </div>
                        </div>
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="name">Website</label>
                                <InputText id="website" value={advertisement.website} onChange={(e) => onInputChange(e, 'website')} required className={classNames({ 'p-invalid': submitted && !advertisement.website })} />
                                {submitted && !advertisement.website && <small className="p-invalid">Website is required.</small>}
                            </div>
                        </div>
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="Email">Email</label>
                                <InputText id="Email" value={advertisement.Email} onChange={(e) => onInputChange(e, 'Email')} required className={classNames({ 'p-invalid': submitted && !advertisement.Email })} />
                            </div>
                        </div>
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="phone">Phone</label>
                                <InputText id="phone" value={advertisement.phone} onChange={(e) => onInputChange(e, 'phone')} required className={classNames({ 'p-invalid': submitted && !advertisement.phone })} />
                            </div>
                        </div>
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="photo">Photo</label>
                                <FileUpload name="demo[]" url={`${contextPath}/upload.php`} onUpload={onUpload} multiple accept="image/*" maxFileSize={40000000} />
                            </div>
                        </div>
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="description">Description</label>
                                <InputText id="description" value={advertisement.description} onChange={(e) => onInputChange(e, 'description')} required className={classNames({ 'p-invalid': submitted && !advertisement.description })} />
                            </div>
                        </div>
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="releaseDate">Released Date</label>
                                <Calendar id="releaseDate" dateFormat="dd/mm/yy" showIcon showButtonBar value={advertisement.release} onChange={(e) => (e.value as Date, 'releaseDate')}></Calendar>
                            </div>
                            <div className="field col">
                                <label htmlFor="expired">Expiry Date</label>
                                <Calendar id="expired" dateFormat="dd/mm/yy" showIcon showButtonBar value={advertisement.expire} onChange={(e) => (e.value as Date, 'expired')}></Calendar>
                            </div>
                        </div>
                        <div className="formgrid grid col">
                            <div className="field-checkbox">
                                <InputSwitch id='activated' checked={switchValue} onChange={(e) => setSwitchValue(e.value ?? false)} />
                                <label htmlFor="activated">Activated</label>
                            </div>
                        </div>
                    </Dialog >

                    <Dialog visible={deleteAdvertisementDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteAdvertisementDialogFooter} onHide={hideDeleteAdvertisementDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {advertisement && (
                                <span>
                                    Are you sure you want to delete <b>{advertisement.name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteAdvertisementsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteAdvertisementsDialogFooter} onHide={hideDeleteAdvertisementsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {advertisement && <span>Are you sure you want to delete the selected advertisements?</span>}
                        </div>
                    </Dialog>
                </div >
            </div >
        </div >
    );
};

export default Advertisements;