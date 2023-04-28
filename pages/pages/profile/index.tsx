import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { RadioButton } from 'primereact/radiobutton';
import { Checkbox, CheckboxChangeEvent } from 'primereact/checkbox';
import { InputSwitch } from 'primereact/inputswitch';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import router from 'next/router';

export const UserProfile = () => {

    const [languageItem, setLanguageItem] = useState("English");
    const languageItems = [
        { name: 'English', code: 'EN' },
        { name: 'Khmer', code: 'KM' }
    ];
    const [radioValue, setRadioValue] = useState(null);
    const [checkboxValue, setCheckboxValue] = useState<string[]>([]);
    const [switchValue, setSwitchValue] = useState(false);
    const onCheckboxChange = (e: CheckboxChangeEvent) => {
        let selectedValue = [...checkboxValue];
        if (e.checked) selectedValue.push(e.value);
        else selectedValue.splice(selectedValue.indexOf(e.value), 1);

        setCheckboxValue(selectedValue);
    };
    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                    <Button label="Save" icon="pi pi-check" className="mr-2 inline-block"/>
                    <Button label="Cancel" onClick={() => router.push("/")} icon="pi pi-times" />
            </React.Fragment>
        );
    };

    return (
        <div className="grid p-fluid">
            <div className="col-12 md:col-6">
                <div className="card">
                    <h5>General Settings</h5>
                    <div className="field">
                        <label htmlFor="name">Name:</label>
                        <InputText id="name" type="text" />
                    </div>
                    <div className="field">
                        <label htmlFor="email">Email:</label>
                        <InputText id="email" type="text" />
                    </div>
                    <div className="field">
                        <label htmlFor="phone">Phone:</label>
                        <InputText id="phone" type="text" />
                    </div>
                    <div className="field">
                        <label htmlFor="state">Language:</label>
                        <Dropdown id="language" value={languageItem} onChange={(e) => setLanguageItem(e.value)} options={languageItems} optionLabel="name" ></Dropdown>
                    </div>
                </div>

            </div>
            <div className="col-12 md:col-6">
                <div className="card">
                    <h5>Change Password</h5>
                    <div className="field">
                        <label htmlFor="name1">Old Password:</label>
                        <InputText id="name1" type="password" />
                    </div>
                    <div className="field">
                        <label htmlFor="email1">New Password:</label>
                        <InputText id="email1" type="password" />
                    </div>
                    <div className="field">
                        <label htmlFor="age1">Retype Password:</label>
                        <InputText id="age1" type="password" />
                    </div>

                </div>
                <Toolbar className="mb-4" center={rightToolbarTemplate}></Toolbar>

            </div>

            <div className="col-12 md:col-6">
                <div className="card">
                    <h5>RadioButton</h5>
                    <div className="grid">
                        <div className="col-12 md:col-4">
                            <div className="field-radiobutton">
                                <RadioButton inputId="option1" name="option" value="Chicago" checked={radioValue === 'Chicago'} onChange={(e) => setRadioValue(e.value)} />
                                <label htmlFor="option1">Chicago</label>
                            </div>
                        </div>
                        <div className="col-12 md:col-4">
                            <div className="field-radiobutton">
                                <RadioButton inputId="option2" name="option" value="Los Angeles" checked={radioValue === 'Los Angeles'} onChange={(e) => setRadioValue(e.value)} />
                                <label htmlFor="option2">Los Angeles</label>
                            </div>
                        </div>
                        <div className="col-12 md:col-4">
                            <div className="field-radiobutton">
                                <RadioButton inputId="option3" name="option" value="New York" checked={radioValue === 'New York'} onChange={(e) => setRadioValue(e.value)} />
                                <label htmlFor="option3">New York</label>
                            </div>
                        </div>
                    </div>

                    <h5>Checkbox</h5>
                    <div className="grid">
                        <div className="col-12 md:col-4">
                            <div className="field-checkbox">
                                <Checkbox inputId="checkOption1" name="option" value="Chicago" checked={checkboxValue.indexOf('Chicago') !== -1} onChange={onCheckboxChange} />
                                <label htmlFor="checkOption1">Chicago</label>
                            </div>
                        </div>
                        <div className="col-12 md:col-4">
                            <div className="field-checkbox">
                                <Checkbox inputId="checkOption2" name="option" value="Los Angeles" checked={checkboxValue.indexOf('Los Angeles') !== -1} onChange={onCheckboxChange} />
                                <label htmlFor="checkOption2">Los Angeles</label>
                            </div>
                        </div>
                        <div className="col-12 md:col-4">
                            <div className="field-checkbox">
                                <Checkbox inputId="checkOption3" name="option" value="New York" checked={checkboxValue.indexOf('New York') !== -1} onChange={onCheckboxChange} />
                                <label htmlFor="checkOption3">New York</label>
                            </div>
                        </div>
                    </div>

                    <h5>Input Switch</h5>
                    <InputSwitch checked={switchValue} onChange={(e) => setSwitchValue(e.value ?? false)} />
                </div>
            </div>

        </div>

    );
};

export default UserProfile;
