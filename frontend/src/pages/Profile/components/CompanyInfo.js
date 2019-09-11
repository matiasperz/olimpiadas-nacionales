import React from 'react';

const CompanyInfo = (props) => {
    return (
        <div className="box box-warning">
            <div className="box-header with-border">
                <h3 className="box-title">Company Info</h3>
            </div>
            <div className="box-body">
                <ul className="list-group">
                    <li className="list-group-item">
                        <b>Company name</b>
                        <p className="pull-right">{props.companyName}</p>
                    </li>
                    <li className="list-group-item">
                        <b>Company owner</b>
                        <p className="pull-right">{props.ownerCompany}</p>
                    </li>
                    <li className="list-group-item">
                        <b>Company address</b>
                        <p className="pull-right">{props.address}</p>
                    </li>
                    <li className="list-group-item">
                        <b>Company fiscal code</b>
                        <p className="pull-right">{props.fiscalCode}</p>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default CompanyInfo;