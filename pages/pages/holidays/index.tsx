import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';

import React, { useEffect, useRef, useState } from 'react';
import { HolidayService } from '../../../src/services/HolidayService';
import {BASE_URL_API} from '../../../src/services/API';
import { DTO } from '../../../types/dto';
import getConfig from 'next/config';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { InputTextarea } from 'primereact/inputtextarea';

interface InputValue {
    name: string;
    code: string;
}

const Holidays = () => {

    let emptyCalendar: DTO.CalendarTable = {
        id: 0,
        date: '',
        status: 1,
        comment: '',
    };

    const [calendars, setCalendars] = useState<DTO.CalendarTable[]>([]);
    const [calendarDialog, setCalendarDialog] = useState(false);
    const [statusValue, setStatusValue] = useState(null);
    const [deleteCalendarDialog, setDeleteCalendarDialog] = useState(false);
    const [deleteCalendarsDialog, setDeleteCalendarsDialog] = useState(false);
    const [calendar, setCalendar] = useState<DTO.CalendarTable>(emptyCalendar);
    const [selectedCalendars, setSelectedCalendars] = useState<DTO.CalendarTable[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<DTO.CalendarTable[]>>(null);
    const holidayService = new HolidayService(BASE_URL_API);

    useEffect(() => {
        holidayService.getHolidays().then((data) => setCalendars(data));
    }, []);

    const openNew = () => {
        setCalendar(emptyCalendar);
        setSubmitted(false);
        setCalendarDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setCalendarDialog(false);
    };

    const hideDeleteCalendarDialog = () => {
        setDeleteCalendarDialog(false);
    };

    const hideDeleteCalendarsDialog = () => {
        setDeleteCalendarsDialog(false);
    };

    const saveCalendar = () => {
        setSubmitted(true);

        if (calendar.date.trim()) {
            let _calendars = [...calendars];
            let _calendar = { ...calendar };
            if (calendar.id) {
                const index = findIndexById(calendar.id);
                _calendars[index] = _calendar;
                holidayService.updateHoliday(_calendar.id, _calendar.date, _calendar.status, _calendar.comment)
                toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Calendar Updated', life: 3000 });
            } else {
                _calendars.push(_calendar);
                holidayService.createHoliday(_calendar.date, _calendar.status, _calendar.comment);                
                toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Calendar Created', life: 3000 });
            }

            setCalendars(_calendars);
            setCalendarDialog(false);
            setCalendar(emptyCalendar);
        }
    };

    const editCalendar = (calendar: DTO.CalendarTable) => {
        setCalendar({ ...calendar });
        setCalendarDialog(true);
    };

    const concalendarDeleteCalendar = (calendar: DTO.CalendarTable) => {
        setCalendar(calendar);
        setDeleteCalendarDialog(true);
    };

    const deleteCalendar = () => {
        let _calendars = calendars.filter((val) => val.id !== calendar.id);
        setCalendars(_calendars);
        setDeleteCalendarDialog(false);
        setCalendar(emptyCalendar);
        toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Calendar Deleted', life: 3000 });
    };

    const findIndexById = (id: number) => {
        let index = -1;
        for (let i = 0; i < calendars.length; i++) {
            if (calendars[i].id === id) {
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
        setDeleteCalendarsDialog(true);
    };

    const deleteSelectedCalendars = () => {
        let _calendars = calendars.filter((val) => !selectedCalendars?.includes(val));
        setCalendars(_calendars);
        setDeleteCalendarsDialog(false);
        setSelectedCalendars([]);
        toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Calendars Deleted', life: 3000 });
    };

    const setValue = (e: React.ChangeEvent<HTMLTextAreaElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _calendar = { ...calendar };
        _calendar[`${name}`] = val;

        setCalendar(_calendar);
    };

    const statusValues: InputValue[] = [
        { name: 'Business Day', code: 'BD' },
        { name: 'Holiday', code: 'HD' },
    ];

    const onUpload = () => {
        toast.current?.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedCalendars || !selectedCalendars.length} />
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

    const idBodyTemplate = (rowData: DTO.CalendarTable) => {
        return (
            <>
                <span className="p-column-title">Id</span>
                {rowData.id}
            </>
        );
    };

    const dateBodyTemplate = (rowData: DTO.CalendarTable) => {
        return (
            <>
                <span className="p-column-title">Date</span>
                {rowData.date}
            </>
        );
    };

    const statusBodyTemplate = (rowData: DTO.CalendarTable) => {
        return (
            <>
                <span className="p-column-title">Status</span>
                {rowData.status}
            </>
        );
    };

    const commentBodyTemplate = (rowData: DTO.CalendarTable) => {
        return (
            <>
                <span className="p-column-title">Comment</span>
                {rowData.comment}

            </>
        );
    };

    const actionBodyTemplate = (rowData: DTO.CalendarTable) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editCalendar(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => concalendarDeleteCalendar(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage Calendars</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const calendarDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-save" className="p-button-text" onClick={saveCalendar} />
        </>
    );

    const deleteCalendarDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteCalendarDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteCalendar} />
        </>
    );
    const deleteCalendarsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteCalendarsDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteSelectedCalendars} />
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
                        value={calendars}
                        selection={selectedCalendars}
                        onSelectionChange={(e) => setSelectedCalendars(e.value as DTO.CalendarTable[])}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} calendars"
                        globalFilter={globalFilter}
                        emptyMessage="No calendars found."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '1rem' }}></Column>
                        <Column field="id" header="Id" sortable body={idBodyTemplate} headerStyle={{ minWidth: '2rem' }}></Column>
                        <Column field="date" header="Date" sortable body={dateBodyTemplate} headerStyle={{ minWidth: '8rem' }}></Column>
                        <Column field="status" header="Status" sortable body={statusBodyTemplate} headerStyle={{ minWidth: '8rem' }}></Column>
                        <Column field="comment" header="Comment" body={commentBodyTemplate} sortable headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={calendarDialog} style={{ width: '450px' }} header="Holiday Details" modal className="p-fluid" footer={calendarDialogFooter} onHide={hideDialog}>
                    <div className="formgrid grid">
                        <div className="field col">
                            <label htmlFor="date">Date</label>
                            <Calendar id="date" dateFormat="dd/mm/yy" showIcon showButtonBar value={calendar.date} onChange={(e) => (e.value as Date, 'date')}> </Calendar>
                        </div>
                    </div>
                    <div className="formgrid grid">
                        <div className="field col">
                            <label htmlFor="status">Status</label>
                            <Dropdown value={statusValue} onChange={(e) => setStatusValue(e.value)} options={statusValues} optionLabel="name" placeholder="Select" />
                        </div>
                    </div>
                    <div className="formgrid grid">
                        <div className="field col">
                                <label htmlFor="comment">Description</label>
                                <InputTextarea value={calendar.comment} onChange={(e) => setValue(e, 'comment')} rows={2} autoFocus />
                        </div>
                    </div>    
                    </Dialog>
                    <Dialog visible={deleteCalendarDialog} style={{ width: '450px' }} header="Concalendar" modal footer={deleteCalendarDialogFooter} onHide={hideDeleteCalendarDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {calendar && (
                                <span>
                                    Are you sure you want to delete <b>{calendar.id}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteCalendarsDialog} style={{ width: '450px' }} header="Concalendar" modal footer={deleteCalendarsDialogFooter} onHide={hideDeleteCalendarsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {calendar && <span>Are you sure you want to delete the selected calendars?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Holidays;
