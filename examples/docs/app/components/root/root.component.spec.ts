import { async, TestBed } from '@angular/core/testing';

import { RootComponent } from './root.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('RootComponent', () => {

    beforeEach(async() => {
        TestBed.configureTestingModule({
            schemas: [
                CUSTOM_ELEMENTS_SCHEMA
            ],
            declarations: [
                RootComponent
            ]
        });
    });

    // Extremely basic example test. Just checks that the created Component is the type we expect.
    it('creates the component', async(() => {
        let fixture = TestBed.createComponent(RootComponent);

        expect(fixture.componentInstance instanceof RootComponent).toBe(true);
    }));

});