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
import { BASE_URL_API } from '../../../src/services/API';
import { IssueService } from '../../../src/services/IssueService';
import { DTO } from '../../../types/dto';

const Issues = () => {

    let emptySecurity: DTO.IssuesTable = 
    {
        id: 0,
        icode: '',
        iname: '',
        inameAbbrev: '',
        inameEnglish: '',
        inameEnglishAbbrev: '',
        created: '',
    };

    const [securities, setSecurities] = useState<DTO.IssuesTable[]>([]);
    const [securityDialog, setSecurityDialog] = useState(false);
    const [deleteSecurityDialog, setDeleteSecurityDialog] = useState(false);
    const [deleteSecuritiesDialog, setDeleteSecuritiesDialog] = useState(false);
    const [security, setSecurity] = useState<DTO.IssuesTable>(emptySecurity);
    const [selectedSecurities, setSelectedSecurities] = useState<DTO.IssuesTable[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<DTO.IssuesTable[]>>(null);
    const issueService = new IssueService(BASE_URL_API);

    useEffect(() => {
        issueService.getIssues().then((data) => setSecurities(data));
    }, []);

    const openNew = () => {
        setSecurity(emptySecurity);
        setSubmitted(false);
        setSecurityDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setSecurityDialog(false);
    };

    const hideDeleteSecurityDialog = () => {
        setDeleteSecurityDialog(false);
    };

    const hideDeleteSecuritiesDialog = () => {
        setDeleteSecuritiesDialog(false);
    };

    const saveSecurity = () => {
        setSubmitted(true);

        if (security.icode.trim()) {
            let _securities = [...securities];
            let _security = { ...security };
            if (security.id) {
                const index = findIndexById(security.id);
                _securities[index] = _security;
                issueService.updateIssue(_security.id, _security.icode, _security.inameAbbrev, _security.inameEnglishAbbrev, _security.iname, _security.inameEnglish);
                toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Security Updated', life: 3000 });
            } else {
                _securities.push(_security);
                issueService.createIssue(_security.icode, _security.iname, _security.inameAbbrev, _security.inameEnglish, _security.inameEnglishAbbrev);
                toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Security Created', life: 3000 });
            }

            setSecurities(_securities);
            setSecurityDialog(false);
            setSecurity(emptySecurity);
        }
    };

    const editSecurity = (security: DTO.IssuesTable) => {
        setSecurity({ ...security });
        setSecurityDialog(true);
    };

    const confirmDeleteSecurity = (security: DTO.IssuesTable) => {
        setSecurity(security);
        setDeleteSecurityDialog(true);
    };

    const deleteSecurity = () => {
        let _securities = securities.filter((val) => val.id !== security.id);
        setSecurities(_securities);
        setDeleteSecurityDialog(false);
        setSecurity(emptySecurity);
        toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Security Deleted', life: 3000 });
    };

    const findIndexById = (id: number) => {
        let index = -1;
        for (let i = 0; i < securities.length; i++) {
            if (securities[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const consecurityDeleteSelected = () => {
        setDeleteSecuritiesDialog(true);
    };

    const deleteSelectedSecurities = () => {
        let _securities = securities.filter((val) => !selectedSecurities?.includes(val));
        setSecurities(_securities);
        setDeleteSecuritiesDialog(false);
        setSelectedSecurities([]);
        toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Securities Deleted', life: 3000 });
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _security = { ...security };
        _security[`${name}`] = val;

        setSecurity(_security);
    };

    const onUpload = () => {
        toast.current?.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={consecurityDeleteSelected} disabled={!selectedSecurities || !selectedSecurities.length} />
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

    const idBodyTemplate = (rowData: DTO.IssuesTable) => {
        return (
            <>
                <span className="p-column-title">Id</span>
                {rowData.id}
            </>
        );
    };

    const issueCodeBodyTemplate = (rowData: DTO.IssuesTable) => {
        return (
            <>
                <span className="p-column-title">Issue Code</span>
                {rowData.icode}
            </>
        );
    };

    const issueNameKhBodyTemplate = (rowData: DTO.IssuesTable) => {
        return (
            <>
                <span className="p-column-title">Issue Name (KH)</span>
                {rowData.iname}
            </>
        );
    };

    const issueNameEnBodyTemplate = (rowData: DTO.IssuesTable) => {
        return (
            <>
                <span className="p-column-title">Issue Name (EN)</span>
                {rowData.inameEnglish}

            </>
        );
    };

    const abbreviationKhBodyTemplate = (rowData: DTO.IssuesTable) => {
        return (
            <>
                <span className="p-column-title">Abbreviation (KH)</span>
                {rowData.inameAbbrev}
            </>
        );
    };

    const abbreviationEngBodyTemplate = (rowData: DTO.IssuesTable) => {
        return (
            <>
                <span className="p-column-title">Abbreviation (EN)</span>
                {rowData.inameEnglishAbbrev}
            </>
        );
    };

    const createdBodyTemplate = (rowData: DTO.IssuesTable) => {
        return (
            <>
                <span className="p-column-title">Created</span>
                {rowData.created}
            </>
        );
    };

    const actionBodyTemplate = (rowData: DTO.IssuesTable) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editSecurity(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteSecurity(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage Securities</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const securityDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-save" className="p-button-text" onClick={saveSecurity} />
        </>
    );

    const deleteSecurityDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteSecurityDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteSecurity} />
        </>
    );
    const deleteSecuritiesDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteSecuritiesDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteSelectedSecurities} />
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
                        value={securities}
                        selection={selectedSecurities}
                        onSelectionChange={(e) => setSelectedSecurities(e.value as DTO.IssuesTable[])}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} securities"
                        globalFilter={globalFilter}
                        emptyMessage="No securities found."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '1rem' }}></Column>
                        <Column field="id" header="Id" sortable body={idBodyTemplate} headerStyle={{ minWidth: '2rem' }}></Column>
                        <Column field="issueCode" header="Issue Code" sortable body={issueCodeBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="issueNameKh" header="Issue Name (KH)" sortable body={issueNameKhBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="abbreviationKh" header="Abbreviation (KH)" body={abbreviationKhBodyTemplate} sortable headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="issueNameEn" header="Issue Name(EN)" sortable body={issueNameEnBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="abbreviationEng" header="Abbreviation (EN)" body={abbreviationEngBodyTemplate} sortable headerStyle={{ minWidth: '8rem' }}></Column>
                        <Column field="created" header="Created" sortable body={createdBodyTemplate} headerStyle={{ minWidth: '8rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '8rem' }}></Column>
                    </DataTable>

                    <Dialog visible={securityDialog} style={{ width: '450px' }} header="Security Details" modal className="p-fluid" footer={securityDialogFooter} onHide={hideDialog}>
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="icode">Issue Code</label>
                                <InputText id="icode" value={security.icode} onChange={(e) => onInputChange(e, 'icode')} required className={classNames({ 'p-invalid': submitted && !security.icode })} />
                                {submitted && !security.icode && <small className="p-invalid">Issue Code is required.</small>}
                            </div>
                        </div>
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="inameAbbrev">Abbreviation (KH)</label>
                                <InputText id="inameAbbrev" value={security.inameAbbrev} onChange={(e) => onInputChange(e, 'inameAbbrev')} required className={classNames({ 'p-invalid': submitted && !security.inameAbbrev })} />
                                {submitted && !security.inameAbbrev && <small className="p-invalid">Abbreviation (KH) is required.</small>}
                            </div>
                            <div className="field col">
                                <label htmlFor="inameEnglishAbbrev">Abbreviation (EN)</label>
                                <InputText id="inameEnglishAbbrev" value={security.inameEnglishAbbrev} onChange={(e) => onInputChange(e, 'inameEnglishAbbrev')} required className={classNames({ 'p-invalid': submitted && !security.inameEnglishAbbrev })} />
                                {submitted && !security.inameEnglishAbbrev && <small className="p-invalid">Abbreviation (EN) is required.</small>}
                            </div>
                        </div>
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="iname">Issue Name (KH)</label>
                                <InputText id="iname" value={security.iname} onChange={(e) => onInputChange(e, 'iname')} required autoFocus className={classNames({ 'p-invalid': submitted && !security.iname })} />
                                {submitted && !security.iname && <small className="p-invalid">Issue Name (KH) is required.</small>}
                            </div>
                        </div>
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="inameEnglish">Issue Name (EN)</label>
                                <InputText id="inameEnglish" value={security.inameEnglish} onChange={(e) => onInputChange(e, 'inameEnglish')} required autoFocus className={classNames({ 'p-invalid': submitted && !security.inameEnglish })} />
                                {submitted && !security.inameEnglish && <small className="p-invalid">Issue Name (EN) is required.</small>}
                            </div>
                        </div>


                    </Dialog>
                    <Dialog visible={deleteSecurityDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteSecurityDialogFooter} onHide={hideDeleteSecurityDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {security && (
                                <span>
                                    Are you sure you want to delete <b>{security.issueNameEn}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteSecuritiesDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteSecuritiesDialogFooter} onHide={hideDeleteSecuritiesDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {security && <span>Are you sure you want to delete the selected securities?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Issues;
