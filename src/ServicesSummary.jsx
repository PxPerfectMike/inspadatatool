import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import csv from 'csvtojson';
import {
	Container,
	Paper,
	Typography,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from '@mui/material';

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
	const [dateRange, setDateRange] = useState({ start: '', end: '' });

	const onDrop = useCallback((acceptedFiles) => {
		acceptedFiles.forEach((file) => {
			const reader = new FileReader();

			reader.onload = () => {
				csv()
					.fromString(reader.result)
					.then((jsonObj) => {
						const dates = jsonObj.map((obj) => new Date(obj['Sale Date']));
						const minDate = new Date(Math.min.apply(null, dates));
						const maxDate = new Date(Math.max.apply(null, dates));

						setDateRange({
							start: `${
								minDate.getMonth() + 1
							}/${minDate.getDate()}/${minDate.getFullYear()}`,
							end: `${
								maxDate.getMonth() + 1
							}/${maxDate.getDate()}/${maxDate.getFullYear()}`,
						});

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

	const { getRootProps, getInputProps } = useDropzone({ onDrop });

	return (
		<Container
			className='mainContainer'
			sx={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				height: '100vh',
				gap: 2,
			}}
		>
			<Paper
				elevation={3}
				{...getRootProps()}
				className='dragNDropContainer'
				sx={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					width: '30%',
					height: '30%',
					padding: 2,
					textAlign: 'center',
					cursor: 'pointer',
					gap: 2,
					backgroundColor: '#f5f5f5',
				}}
			>
				<input {...getInputProps()} />
				<div
					style={{
						padding: 2,
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'space-around',
					}}
				>
					<Typography>Select a date range on Zenoti</Typography>
					<Typography>Click "Refresh"</Typography>
					<Typography>Click "download CSV" from the right</Typography>
					<Typography>Drag 'n' drop CSV here</Typography>
				</div>
			</Paper>
			<TableContainer component={Paper} elevation={3}>
				<Typography variant='h6' style={{ padding: '1em' }}>
					Date Range: {dateRange.start} - {dateRange.end}
				</Typography>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Service</TableCell>
							<TableCell align='right'>Sale Value</TableCell>
							<TableCell align='right'>Number of Services</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{services.map((service) => {
							const data = serviceData.find((d) => d.service === service) || {
								sum: 0,
								count: 0,
							};
							return (
								<TableRow key={service}>
									<TableCell component='th' scope='row'>
										{service}
									</TableCell>
									<TableCell align='right'>{`$${data.sum.toFixed(
										2
									)}`}</TableCell>
									<TableCell align='right'>{data.count}</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</TableContainer>
		</Container>
	);
};

export default ServicesSummary;
