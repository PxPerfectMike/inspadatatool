import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import csv from 'csvtojson';

const services = [
	'manicure',
	'facial',
	'lash',
	'massage',
	'waxing',
	'pedicure',
];

const ServicesSummary = () => {
	const [serviceData, setServiceData] = useState([]);

	const onDrop = useCallback((acceptedFiles) => {
		acceptedFiles.forEach((file) => {
			const reader = new FileReader();

			reader.onload = () => {
				csv()
					.fromString(reader.result)
					.then((jsonObj) => {
						const newServiceData = services.map((service) => {
							const filteredData = jsonObj.filter(
								(item) =>
									item.ServiceName.toLowerCase().includes(service) ||
									item.Category.toLowerCase().includes(service) ||
									item['Sub Category'].toLowerCase().includes(service)
							);

							const sum = filteredData.reduce(
								(total, item) => total + (Number(item['Sale Value']) || 0),
								0
							);
							const count = filteredData.length;

							return { service, sum, count };
						});

						setServiceData(newServiceData);
					});
			};

			reader.readAsText(file);
		});
	}, []);

	const style = {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		width: '200px',
		height: '200px',
		borderWidth: '2px',
		borderColor: '#666',
		borderStyle: 'dashed',
		borderRadius: '5px',
		textAlign: 'center',
	};

	const { getRootProps, getInputProps } = useDropzone({ onDrop });

	return (
		<div>
			<div {...getRootProps()}>
				<input {...getInputProps()} />
				<div style={style}>
					<p>Select date range on Zenoti</p>
					<p>Click refresh</p>
					<p>Click "download CSV" from the right</p>
					<p>Drag 'n' drop CSV here</p>
				</div>
			</div>

			<ul>
				{serviceData.map(({ service, sum, count }) => (
					<li key={service}>
						<h2>{service}</h2>
						<p>Sale Value: {`$${sum.toFixed(2)}`}</p>
						<p>Number of Services: {count}</p>
					</li>
				))}
			</ul>
		</div>
	);
};

export default ServicesSummary;
