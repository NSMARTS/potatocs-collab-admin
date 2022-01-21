import { Component, OnDestroy, OnInit } from '@angular/core';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-index',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.scss'],
})
export class IndexComponent implements OnInit, OnDestroy {
    mediaSub: Subscription;

    constructor(public mediaObserver: MediaObserver) {}

    ngOnInit(): void {
        this.mediaSub = this.mediaObserver.media$.subscribe(
            (result: MediaChange) => {
                console.log(result.mqAlias);
            },
        );
    }

    ngOnDestroy(): void {
        this.mediaSub.unsubscribe();
    }
}
