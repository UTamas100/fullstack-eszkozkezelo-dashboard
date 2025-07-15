import {CommonModule} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {Component,
    inject,
    OnInit} from '@angular/core';
import {FormBuilder,
    ReactiveFormsModule} from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {ChartModule} from 'primeng/chart';
import {InputTextModule} from 'primeng/inputtext';
import {TableModule} from 'primeng/table';

interface Device {
    _id: number;
    name: string;
    type: string;
    ip: string;
    status: 'active'|'inactive'|'error';
    location: string;
}

@Component({
    selector : 'app-dashboard',
    standalone : true,
    imports : [ CommonModule, ReactiveFormsModule, TableModule, InputTextModule, ButtonModule, ChartModule ],
    templateUrl : './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
    private http = inject(HttpClient);
    private fb = inject(FormBuilder);

    autoRefreshEnabled = true;
    private intervalId: any = null;

    devices: Device[] = [];
    chartData: any;
    chartOptions: any;
    deviceForm = this.fb.group({
        name : '',
        type: '',
        ip: '',
        location: ''
    });

    history: { active: number; error : number; inactive : number; time : string }[] = [];

    ngOnInit()
    {
        this.fetchDevices();
        this.startAutoRefresh();
    }

    fetchDevices()
    {
        this.http.get<Device[]>('http://localhost:3000/devices').subscribe(data => {
            this.devices = data;
            this.updateChartData();
        });
    }

    startAutoRefresh()
    {
        if (this.intervalId === null) {
            this.intervalId = setInterval(() => {
                if (this.autoRefreshEnabled) {
                    this.fetchDevices();
                }
            }, 4000);
        }
    }

    toggleAutoRefresh()
    {
        this.autoRefreshEnabled = !this.autoRefreshEnabled;
    }

    addDevice()
    {
        if (this.deviceForm.valid) {
            this.http.post<Device>('http://localhost:3000/devices', this.deviceForm.value).subscribe(() => {
                this.deviceForm.reset();
                this.fetchDevices();
            });
        }
    }

    deleteDevice(id: string)
    {
        this.http.delete(`http://localhost:3000/devices/${id}`).subscribe(() => {
            this.fetchDevices();
        });
    }

    updateChartData()
    {
        const counts = { active : 0, error : 0, inactive : 0 };
        this.devices.forEach(d => counts[d.status]++);

        const time = new Date().toLocaleTimeString();
        this.history.push({...counts, time });
        if (this.history.length > 10)
            this.history.shift();

        this.chartData = {
            labels : this.history.map(h => h.time),
            datasets : [
                { label : 'Active', data : this.history.map(h => h.active), borderColor : '#4caf50' },
                { label : 'Error', data : this.history.map(h => h.error), borderColor : '#f44336' },
                { label : 'Inactive', data : this.history.map(h => h.inactive), borderColor : '#9e9e9e' }
            ]
        };

        this.chartOptions = {
            responsive : false,
            maintainAspectRatio : false,
            plugins : {
                legend : {
                    position : 'top'
                },
                title : {
                    display : true,
                    text : 'Eszközök státuszainak alakulása'
                }
            },
            scales : {
                x : {
                    title : {
                        display : true,
                        text : 'Idő'
                    }
                },
                y : {
                    beginAtZero : true,
                    title : {
                        display : true,
                        text : 'Eszközök száma'
                    }
                }
            }
        };
    }
}
