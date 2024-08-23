import { Component, HostListener, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-connected-user-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './connected-users-sidebar.component.html',
  styleUrl: './connected-users-sidebar.component.scss'
})
export class ConnectedUsersComponent implements OnInit {
  @Input() title!: string | null;
  @Input({ required: true }) connectedUsers!: Array<string>;
  isVisible: boolean = false;
  private maxWidth!: number;

  set handleVisible(maxWidth: number) {
    this.maxWidth = maxWidth;
    this.isVisible = !(this.maxWidth <= 700);
  }

  ngOnInit(): void {
    this.handleVisible = window.innerWidth;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: { target: { innerWidth: number; }; }) {
    this.handleVisible = event.target.innerWidth;
  }
}
