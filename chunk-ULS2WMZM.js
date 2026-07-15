import{$a as Jt,Aa as ee,Da as te,Ea as be,F as mt,Fa as Je,G as Qt,Ia as Wt,J as Kt,Ja as Gt,Ka as O,La as Ut,N as ze,O as J,Oa as et,Pa as Zt,Qa as tt,R as Oe,Ra as Xt,Sa as it,Ta as Yt,W as Ee,Y as ht,_ as ke,a as Ge,aa as ft,ab as ei,b as Ue,c as _e,d as Ze,da as Pe,e as ye,ea as Be,fa as Fe,i as ae,ia as gt,k as Se,la as qt,mb as je,nb as nt,p as Ht,qa as Xe,sb as ti,ta as ve,tb as ii,ua as Q,va as Ye}from"./chunk-PL2PKBZV.js";import{$b as De,Aa as R,Bb as a,Bc as z,Cb as y,Db as v,Eb as se,Ga as Dt,Hb as Ft,I as st,Ia as zt,Ib as B,Jb as F,K as Ot,Kb as N,Lb as D,Lc as I,M as Et,Mc as Te,Na as Bt,Pa as p,Qb as V,Rb as r,Rc as $t,Sb as Le,Sc as at,Tb as Ae,Ua as S,Ub as M,Uc as pt,V as kt,Va as he,Vb as W,W as Vt,Wb as f,Wc as ct,Xb as g,Xc as dt,Y as Mt,Z as Lt,Zc as ut,_a as fe,_b as le,a as A,b as Me,ba as At,bc as ge,ca as T,cc as h,da as de,db as Z,dc as Ie,eb as ue,ec as Re,fa as U,fb as qe,fc as rt,g as Ct,ga as lt,ha as _,hb as $,hc as Rt,ib as X,ic as Nt,j as It,jb as d,jc as Pt,k as ce,lc as Y,mc as We,na as u,nc as P,oa as m,oc as me,p as Qe,pa as ne,pc as Ne,tc as G,u as Ce,v as Tt,va as Ke,vb as k,y as St,yc as re,zc as jt}from"./chunk-CZOHWAXB.js";var Bi=["data-p-icon","chevron-down"],ni=(()=>{class t extends Zt{static \u0275fac=(()=>{let e;return function(n){return(e||(e=R(t)))(n||t)}})();static \u0275cmp=Z({type:t,selectors:[["","data-p-icon","chevron-down"]],features:[$],attrs:Bi,decls:1,vars:0,consts:[["d","M7.01744 10.398C6.91269 10.3985 6.8089 10.378 6.71215 10.3379C6.61541 10.2977 6.52766 10.2386 6.45405 10.1641L1.13907 4.84913C1.03306 4.69404 0.985221 4.5065 1.00399 4.31958C1.02276 4.13266 1.10693 3.95838 1.24166 3.82747C1.37639 3.69655 1.55301 3.61742 1.74039 3.60402C1.92777 3.59062 2.11386 3.64382 2.26584 3.75424L7.01744 8.47394L11.769 3.75424C11.9189 3.65709 12.097 3.61306 12.2748 3.62921C12.4527 3.64535 12.6199 3.72073 12.7498 3.84328C12.8797 3.96582 12.9647 4.12842 12.9912 4.30502C13.0177 4.48162 12.9841 4.662 12.8958 4.81724L7.58083 10.1322C7.50996 10.2125 7.42344 10.2775 7.32656 10.3232C7.22968 10.3689 7.12449 10.3944 7.01744 10.398Z","fill","currentColor"]],template:function(i,n){i&1&&(ne(),Ft(0,"path",0))},encapsulation:2})}return t})();var oi=`
    .p-chip {
        display: inline-flex;
        align-items: center;
        background: dt('chip.background');
        color: dt('chip.color');
        border-radius: dt('chip.border.radius');
        padding-block: dt('chip.padding.y');
        padding-inline: dt('chip.padding.x');
        gap: dt('chip.gap');
    }

    .p-chip-icon {
        color: dt('chip.icon.color');
        font-size: dt('chip.icon.font.size');
        width: dt('chip.icon.size');
        height: dt('chip.icon.size');
    }

    .p-chip-image {
        border-radius: 50%;
        width: dt('chip.image.width');
        height: dt('chip.image.height');
        margin-inline-start: calc(-1 * dt('chip.padding.y'));
    }

    .p-chip:has(.p-chip-remove-icon) {
        padding-inline-end: dt('chip.padding.y');
    }

    .p-chip:has(.p-chip-image) {
        padding-block-start: calc(dt('chip.padding.y') / 2);
        padding-block-end: calc(dt('chip.padding.y') / 2);
    }

    .p-chip-remove-icon {
        cursor: pointer;
        font-size: dt('chip.remove.icon.size');
        width: dt('chip.remove.icon.size');
        height: dt('chip.remove.icon.size');
        color: dt('chip.remove.icon.color');
        border-radius: 50%;
        transition:
            outline-color dt('chip.transition.duration'),
            box-shadow dt('chip.transition.duration');
        outline-color: transparent;
    }

    .p-chip-remove-icon:focus-visible {
        box-shadow: dt('chip.remove.icon.focus.ring.shadow');
        outline: dt('chip.remove.icon.focus.ring.width') dt('chip.remove.icon.focus.ring.style') dt('chip.remove.icon.focus.ring.color');
        outline-offset: dt('chip.remove.icon.focus.ring.offset');
    }
`;var Fi=["removeicon"],Ri=["*"];function Ni(t,l){if(t&1){let e=D();y(0,"img",4),V("error",function(n){u(e);let o=r();return m(o.imageError(n))}),v()}if(t&2){let e=r();h(e.cx("image")),a("pBind",e.ptm("image"))("src",e.image,Bt)("alt",e.alt)}}function Pi(t,l){if(t&1&&se(0,"span",6),t&2){let e=r(2);h(e.icon),a("pBind",e.ptm("icon"))("ngClass",e.cx("icon"))}}function ji(t,l){if(t&1&&d(0,Pi,1,4,"span",5),t&2){let e=r();a("ngIf",e.icon)}}function Hi(t,l){if(t&1&&(y(0,"div",7),Ie(1),v()),t&2){let e=r();h(e.cx("label")),a("pBind",e.ptm("label")),p(),Re(e.label)}}function $i(t,l){if(t&1){let e=D();y(0,"span",11),V("click",function(n){u(e);let o=r(3);return m(o.close(n))})("keydown",function(n){u(e);let o=r(3);return m(o.onKeydown(n))}),v()}if(t&2){let e=r(3);h(e.removeIcon),a("pBind",e.ptm("removeIcon"))("ngClass",e.cx("removeIcon")),k("tabindex",e.disabled?-1:0)("aria-label",e.removeAriaLabel)}}function Qi(t,l){if(t&1){let e=D();ne(),y(0,"svg",12),V("click",function(n){u(e);let o=r(3);return m(o.close(n))})("keydown",function(n){u(e);let o=r(3);return m(o.onKeydown(n))}),v()}if(t&2){let e=r(3);h(e.cx("removeIcon")),a("pBind",e.ptm("removeIcon")),k("tabindex",e.disabled?-1:0)("aria-label",e.removeAriaLabel)}}function Ki(t,l){if(t&1&&(B(0),d(1,$i,1,6,"span",9)(2,Qi,1,5,"svg",10),F()),t&2){let e=r(2);p(),a("ngIf",e.removeIcon),p(),a("ngIf",!e.removeIcon)}}function qi(t,l){}function Wi(t,l){t&1&&d(0,qi,0,0,"ng-template")}function Gi(t,l){if(t&1){let e=D();y(0,"span",13),V("click",function(n){u(e);let o=r(2);return m(o.close(n))})("keydown",function(n){u(e);let o=r(2);return m(o.onKeydown(n))}),d(1,Wi,1,0,null,14),v()}if(t&2){let e=r(2);h(e.cx("removeIcon")),a("pBind",e.ptm("removeIcon")),k("tabindex",e.disabled?-1:0)("aria-label",e.removeAriaLabel),p(),a("ngTemplateOutlet",e.removeIconTemplate||e._removeIconTemplate)}}function Ui(t,l){if(t&1&&(B(0),d(1,Ki,3,2,"ng-container",3)(2,Gi,2,6,"span",8),F()),t&2){let e=r();p(),a("ngIf",!e.removeIconTemplate&&!e._removeIconTemplate),p(),a("ngIf",e.removeIconTemplate||e._removeIconTemplate)}}var Zi={root:({instance:t})=>["p-chip p-component",{"p-disabled":t.disabled}],image:"p-chip-image",icon:"p-chip-icon",label:"p-chip-label",removeIcon:"p-chip-remove-icon"},si=(()=>{class t extends ee{name="chip";style=oi;classes=Zi;static \u0275fac=(()=>{let e;return function(n){return(e||(e=R(t)))(n||t)}})();static \u0275prov=T({token:t,factory:t.\u0275fac})}return t})();var li=new U("CHIP_INSTANCE"),yt=(()=>{class t extends be{$pcChip=_(li,{optional:!0,skipSelf:!0})??void 0;bindDirectiveInstance=_(O,{self:!0});onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]))}label;icon;image;alt;styleClass;disabled=!1;removable=!1;removeIcon;onRemove=new S;onImageError=new S;visible=!0;get removeAriaLabel(){return this.config.getTranslation(Ye.ARIA).removeLabel}get chipProps(){return this._chipProps}set chipProps(e){this._chipProps=e,e&&typeof e=="object"&&Object.entries(e).forEach(([i,n])=>this[`_${i}`]!==n&&(this[`_${i}`]=n))}_chipProps;_componentStyle=_(si);removeIconTemplate;templates;_removeIconTemplate;onAfterContentInit(){this.templates.forEach(e=>{e.getType()==="removeicon"?this._removeIconTemplate=e.template:this._removeIconTemplate=e.template})}onChanges(e){if(e.chipProps&&e.chipProps.currentValue){let{currentValue:i}=e.chipProps;i.label!==void 0&&(this.label=i.label),i.icon!==void 0&&(this.icon=i.icon),i.image!==void 0&&(this.image=i.image),i.alt!==void 0&&(this.alt=i.alt),i.styleClass!==void 0&&(this.styleClass=i.styleClass),i.removable!==void 0&&(this.removable=i.removable),i.removeIcon!==void 0&&(this.removeIcon=i.removeIcon)}}close(e){this.visible=!1,this.onRemove.emit(e)}onKeydown(e){(e.key==="Enter"||e.key==="Backspace")&&this.close(e)}imageError(e){this.onImageError.emit(e)}static \u0275fac=(()=>{let e;return function(n){return(e||(e=R(t)))(n||t)}})();static \u0275cmp=Z({type:t,selectors:[["p-chip"]],contentQueries:function(i,n,o){if(i&1&&(M(o,Fi,4),M(o,ve,4)),i&2){let s;f(s=g())&&(n.removeIconTemplate=s.first),f(s=g())&&(n.templates=s)}},hostVars:5,hostBindings:function(i,n){i&2&&(k("aria-label",n.label),h(n.cn(n.cx("root"),n.styleClass)),De("display",!n.visible&&"none"))},inputs:{label:"label",icon:"icon",image:"image",alt:"alt",styleClass:"styleClass",disabled:[2,"disabled","disabled",I],removable:[2,"removable","removable",I],removeIcon:"removeIcon",chipProps:"chipProps"},outputs:{onRemove:"onRemove",onImageError:"onImageError"},features:[Y([si,{provide:li,useExisting:t},{provide:te,useExisting:t}]),X([O]),$],ngContentSelectors:Ri,decls:6,vars:4,consts:[["iconTemplate",""],[3,"pBind","class","src","alt","error",4,"ngIf","ngIfElse"],[3,"pBind","class",4,"ngIf"],[4,"ngIf"],[3,"error","pBind","src","alt"],[3,"pBind","class","ngClass",4,"ngIf"],[3,"pBind","ngClass"],[3,"pBind"],["role","button",3,"pBind","class","click","keydown",4,"ngIf"],["role","button",3,"pBind","class","ngClass","click","keydown",4,"ngIf"],["data-p-icon","times-circle","role","button",3,"pBind","class","click","keydown",4,"ngIf"],["role","button",3,"click","keydown","pBind","ngClass"],["data-p-icon","times-circle","role","button",3,"click","keydown","pBind"],["role","button",3,"click","keydown","pBind"],[4,"ngTemplateOutlet"]],template:function(i,n){if(i&1&&(Le(),Ae(0),d(1,Ni,1,5,"img",1)(2,ji,1,1,"ng-template",null,0,G)(4,Hi,2,4,"div",2)(5,Ui,3,2,"ng-container",3)),i&2){let o=le(3);p(),a("ngIf",n.image)("ngIfElse",o),p(3),a("ngIf",n.label),p(),a("ngIf",n.removable)}},dependencies:[ae,Ge,_e,ye,it,Q,O],encapsulation:2,changeDetection:0})}return t})(),Fs=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=ue({type:t});static \u0275inj=de({imports:[yt,Q,Q]})}return t})();var ri=`
    .p-skeleton {
        display: block;
        overflow: hidden;
        background: dt('skeleton.background');
        border-radius: dt('skeleton.border.radius');
    }

    .p-skeleton::after {
        content: '';
        animation: p-skeleton-animation 1.2s infinite;
        height: 100%;
        left: 0;
        position: absolute;
        right: 0;
        top: 0;
        transform: translateX(-100%);
        z-index: 1;
        background: linear-gradient(90deg, rgba(255, 255, 255, 0), dt('skeleton.animation.background'), rgba(255, 255, 255, 0));
    }

    [dir='rtl'] .p-skeleton::after {
        animation-name: p-skeleton-animation-rtl;
    }

    .p-skeleton-circle {
        border-radius: 50%;
    }

    .p-skeleton-animation-none::after {
        animation: none;
    }

    @keyframes p-skeleton-animation {
        from {
            transform: translateX(-100%);
        }
        to {
            transform: translateX(100%);
        }
    }

    @keyframes p-skeleton-animation-rtl {
        from {
            transform: translateX(100%);
        }
        to {
            transform: translateX(-100%);
        }
    }
`;var Xi={root:{position:"relative"}},Yi={root:({instance:t})=>["p-skeleton p-component",{"p-skeleton-circle":t.shape==="circle","p-skeleton-animation-none":t.animation==="none"}]},ai=(()=>{class t extends ee{name="skeleton";style=ri;classes=Yi;inlineStyles=Xi;static \u0275fac=(()=>{let e;return function(n){return(e||(e=R(t)))(n||t)}})();static \u0275prov=T({token:t,factory:t.\u0275fac})}return t})();var pi=new U("SKELETON_INSTANCE"),Ji=(()=>{class t extends be{$pcSkeleton=_(pi,{optional:!0,skipSelf:!0})??void 0;bindDirectiveInstance=_(O,{self:!0});onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]))}styleClass;shape="rectangle";animation="wave";borderRadius;size;width="100%";height="1rem";_componentStyle=_(ai);get containerStyle(){let e=this._componentStyle?.inlineStyles.root,i;return this.size?i=Me(A({},e),{width:this.size,height:this.size,borderRadius:this.borderRadius}):i=Me(A({},e),{width:this.width,height:this.height,borderRadius:this.borderRadius}),i}static \u0275fac=(()=>{let e;return function(n){return(e||(e=R(t)))(n||t)}})();static \u0275cmp=Z({type:t,selectors:[["p-skeleton"]],hostVars:5,hostBindings:function(i,n){i&2&&(k("aria-hidden",!0),ge(n.containerStyle),h(n.cn(n.cx("root"),n.styleClass)))},inputs:{styleClass:"styleClass",shape:"shape",animation:"animation",borderRadius:"borderRadius",size:"size",width:"width",height:"height"},features:[Y([ai,{provide:pi,useExisting:t},{provide:te,useExisting:t}]),X([O]),$],decls:0,vars:0,template:function(i,n){},dependencies:[ae,Q],encapsulation:2,changeDetection:0})}return t})(),el=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=ue({type:t});static \u0275inj=de({imports:[Ji,Q,Q]})}return t})();var ol=(()=>{let l=class l{constructor(){this.load$=new ce(null),this.baseLayer$=new ce("scheme")}};l.\u0275fac=function(n){return new(n||l)},l.\u0275prov=T({token:l,factory:l.\u0275fac,providedIn:"root"});let t=l;return t})();var ci=(()=>{class t extends ii{pcFluid=_(et,{optional:!0,host:!0,skipSelf:!0});fluid=z(void 0,{transform:I});variant=z();size=z();inputSize=z();pattern=z();min=z();max=z();step=z();minlength=z();maxlength=z();$variant=re(()=>this.variant()||this.config.inputStyle()||this.config.inputVariant());get hasFluid(){return this.fluid()??!!this.pcFluid}static \u0275fac=(()=>{let e;return function(n){return(e||(e=R(t)))(n||t)}})();static \u0275dir=qe({type:t,inputs:{fluid:[1,"fluid"],variant:[1,"variant"],size:[1,"size"],inputSize:[1,"inputSize"],pattern:[1,"pattern"],min:[1,"min"],max:[1,"max"],step:[1,"step"],minlength:[1,"minlength"],maxlength:[1,"maxlength"]},features:[$]})}return t})();var di=`
    .p-inputtext {
        font-family: inherit;
        font-feature-settings: inherit;
        font-size: 1rem;
        color: dt('inputtext.color');
        background: dt('inputtext.background');
        padding-block: dt('inputtext.padding.y');
        padding-inline: dt('inputtext.padding.x');
        border: 1px solid dt('inputtext.border.color');
        transition:
            background dt('inputtext.transition.duration'),
            color dt('inputtext.transition.duration'),
            border-color dt('inputtext.transition.duration'),
            outline-color dt('inputtext.transition.duration'),
            box-shadow dt('inputtext.transition.duration');
        appearance: none;
        border-radius: dt('inputtext.border.radius');
        outline-color: transparent;
        box-shadow: dt('inputtext.shadow');
    }

    .p-inputtext:enabled:hover {
        border-color: dt('inputtext.hover.border.color');
    }

    .p-inputtext:enabled:focus {
        border-color: dt('inputtext.focus.border.color');
        box-shadow: dt('inputtext.focus.ring.shadow');
        outline: dt('inputtext.focus.ring.width') dt('inputtext.focus.ring.style') dt('inputtext.focus.ring.color');
        outline-offset: dt('inputtext.focus.ring.offset');
    }

    .p-inputtext.p-invalid {
        border-color: dt('inputtext.invalid.border.color');
    }

    .p-inputtext.p-variant-filled {
        background: dt('inputtext.filled.background');
    }

    .p-inputtext.p-variant-filled:enabled:hover {
        background: dt('inputtext.filled.hover.background');
    }

    .p-inputtext.p-variant-filled:enabled:focus {
        background: dt('inputtext.filled.focus.background');
    }

    .p-inputtext:disabled {
        opacity: 1;
        background: dt('inputtext.disabled.background');
        color: dt('inputtext.disabled.color');
    }

    .p-inputtext::placeholder {
        color: dt('inputtext.placeholder.color');
    }

    .p-inputtext.p-invalid::placeholder {
        color: dt('inputtext.invalid.placeholder.color');
    }

    .p-inputtext-sm {
        font-size: dt('inputtext.sm.font.size');
        padding-block: dt('inputtext.sm.padding.y');
        padding-inline: dt('inputtext.sm.padding.x');
    }

    .p-inputtext-lg {
        font-size: dt('inputtext.lg.font.size');
        padding-block: dt('inputtext.lg.padding.y');
        padding-inline: dt('inputtext.lg.padding.x');
    }

    .p-inputtext-fluid {
        width: 100%;
    }
`;var en=`
    ${di}

    /* For PrimeNG */
   .p-inputtext.ng-invalid.ng-dirty {
        border-color: dt('inputtext.invalid.border.color');
    }

    .p-inputtext.ng-invalid.ng-dirty::placeholder {
        color: dt('inputtext.invalid.placeholder.color');
    }
`,tn={root:({instance:t})=>["p-inputtext p-component",{"p-filled":t.$filled(),"p-inputtext-sm":t.pSize==="small","p-inputtext-lg":t.pSize==="large","p-invalid":t.invalid(),"p-variant-filled":t.$variant()==="filled","p-inputtext-fluid":t.hasFluid}]},ui=(()=>{class t extends ee{name="inputtext";style=en;classes=tn;static \u0275fac=(()=>{let e;return function(n){return(e||(e=R(t)))(n||t)}})();static \u0275prov=T({token:t,factory:t.\u0275fac})}return t})();var mi=new U("INPUTTEXT_INSTANCE"),hi=(()=>{class t extends ti{hostName="";ptInputText=z();bindDirectiveInstance=_(O,{self:!0});$pcInputText=_(mi,{optional:!0,skipSelf:!0})??void 0;ngControl=_(ei,{optional:!0,self:!0});pcFluid=_(et,{optional:!0,host:!0,skipSelf:!0});pSize;variant=z();fluid=z(void 0,{transform:I});invalid=z(void 0,{transform:I});$variant=re(()=>this.variant()||this.config.inputStyle()||this.config.inputVariant());_componentStyle=_(ui);constructor(){super(),jt(()=>{this.ptInputText()&&this.directivePT.set(this.ptInputText())})}onAfterViewInit(){this.writeModelValue(this.ngControl?.value??this.el.nativeElement.value),this.cd.detectChanges()}onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptm("root"))}onDoCheck(){this.writeModelValue(this.ngControl?.value??this.el.nativeElement.value)}onInput(){this.writeModelValue(this.ngControl?.value??this.el.nativeElement.value)}get hasFluid(){return this.fluid()??!!this.pcFluid}static \u0275fac=function(i){return new(i||t)};static \u0275dir=qe({type:t,selectors:[["","pInputText",""]],hostVars:2,hostBindings:function(i,n){i&1&&V("input",function(s){return n.onInput(s)}),i&2&&h(n.cx("root"))},inputs:{hostName:"hostName",ptInputText:[1,"ptInputText"],pSize:"pSize",variant:[1,"variant"],fluid:[1,"fluid"],invalid:[1,"invalid"]},features:[Y([ui,{provide:mi,useExisting:t},{provide:te,useExisting:t}]),X([O]),$]})}return t})();var fi=["content"],on=["overlay"],sn=["*"],ln=(t,l,e)=>({showTransitionParams:t,hideTransitionParams:l,transform:e}),rn=t=>({value:"visible",params:t}),an=t=>({mode:t}),pn=t=>({$implicit:t});function cn(t,l){t&1&&N(0)}function dn(t,l){if(t&1){let e=D();y(0,"div",3,1),V("click",function(n){u(e);let o=r(2);return m(o.onOverlayContentClick(n))})("@overlayContentAnimation.start",function(n){u(e);let o=r(2);return m(o.onOverlayContentAnimationStart(n))})("@overlayContentAnimation.done",function(n){u(e);let o=r(2);return m(o.onOverlayContentAnimationDone(n))}),Ae(2),d(3,cn,1,0,"ng-container",4),v()}if(t&2){let e=r(2);h(e.cn(e.cx("content"),e.contentStyleClass)),a("pBind",e.ptm("content"))("@overlayContentAnimation",P(10,rn,Ne(6,ln,e.showTransitionOptions,e.hideTransitionOptions,e.transformOptions[e.modal?e.overlayResponsiveDirection:"default"]))),p(3),a("ngTemplateOutlet",e.contentTemplate||e._contentTemplate)("ngTemplateOutletContext",P(14,pn,P(12,an,e.overlayMode)))}}function un(t,l){if(t&1){let e=D();y(0,"div",3,0),V("click",function(){u(e);let n=r();return m(n.onOverlayClick())}),d(2,dn,4,16,"div",2),v()}if(t&2){let e=r();h(e.cn(e.cx("root"),e.styleClass)),a("pBind",e.ptm("root")),p(2),a("ngIf",e.visible)}}var mn=`
.p-overlay {
    position: absolute;
    top: 0;
}

.p-overlay-modal {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.p-overlay-content {
    transform-origin: inherit;
}

/* Github Issue #18560 */
.p-component-overlay.p-component {
    position: relative;
}

.p-overlay-modal > .p-overlay-content {
    z-index: 1;
    width: 90%;
}

/* Position */
/* top */
.p-overlay-top {
    align-items: flex-start;
}
.p-overlay-top-start {
    align-items: flex-start;
    justify-content: flex-start;
}
.p-overlay-top-end {
    align-items: flex-start;
    justify-content: flex-end;
}

/* bottom */
.p-overlay-bottom {
    align-items: flex-end;
}
.p-overlay-bottom-start {
    align-items: flex-end;
    justify-content: flex-start;
}
.p-overlay-bottom-end {
    align-items: flex-end;
    justify-content: flex-end;
}

/* left */
.p-overlay-left {
    justify-content: flex-start;
}
.p-overlay-left-start {
    justify-content: flex-start;
    align-items: flex-start;
}
.p-overlay-left-end {
    justify-content: flex-start;
    align-items: flex-end;
}

/* right */
.p-overlay-right {
    justify-content: flex-end;
}
.p-overlay-right-start {
    justify-content: flex-end;
    align-items: flex-start;
}
.p-overlay-right-end {
    justify-content: flex-end;
    align-items: flex-end;
}

.p-overlay-content ~ .p-overlay-content {
    display: none;
}
`,hn={host:"p-overlay-host",root:({instance:t})=>["p-overlay p-component",{"p-overlay-modal p-overlay-mask p-overlay-mask-enter":t.modal,"p-overlay-center":t.modal&&t.overlayResponsiveDirection==="center","p-overlay-top":t.modal&&t.overlayResponsiveDirection==="top","p-overlay-top-start":t.modal&&t.overlayResponsiveDirection==="top-start","p-overlay-top-end":t.modal&&t.overlayResponsiveDirection==="top-end","p-overlay-bottom":t.modal&&t.overlayResponsiveDirection==="bottom","p-overlay-bottom-start":t.modal&&t.overlayResponsiveDirection==="bottom-start","p-overlay-bottom-end":t.modal&&t.overlayResponsiveDirection==="bottom-end","p-overlay-left":t.modal&&t.overlayResponsiveDirection==="left","p-overlay-left-start":t.modal&&t.overlayResponsiveDirection==="left-start","p-overlay-left-end":t.modal&&t.overlayResponsiveDirection==="left-end","p-overlay-right":t.modal&&t.overlayResponsiveDirection==="right","p-overlay-right-start":t.modal&&t.overlayResponsiveDirection==="right-start","p-overlay-right-end":t.modal&&t.overlayResponsiveDirection==="right-end"}],content:"p-overlay-content"},gi=(()=>{class t extends ee{name="overlay";style=mn;classes=hn;static \u0275fac=(()=>{let e;return function(n){return(e||(e=R(t)))(n||t)}})();static \u0275prov=T({token:t,factory:t.\u0275fac})}return t})(),_i=new U("OVERLAY_INSTANCE"),fn=dt([pt({transform:"{{transform}}",opacity:0}),at("{{showTransitionParams}}")]),gn=dt([at("{{hideTransitionParams}}",pt({transform:"{{transform}}",opacity:0}))]),yi=(()=>{class t extends be{overlayService;zone;$pcOverlay=_(_i,{optional:!0,skipSelf:!0})??void 0;hostName="";get visible(){return this._visible}set visible(e){this._visible=e,this._visible&&!this.modalVisible&&(this.modalVisible=!0)}get mode(){return this._mode||this.overlayOptions?.mode}set mode(e){this._mode=e}get style(){return je.merge(this._style,this.modal?this.overlayResponsiveOptions?.style:this.overlayOptions?.style)}set style(e){this._style=e}get styleClass(){return je.merge(this._styleClass,this.modal?this.overlayResponsiveOptions?.styleClass:this.overlayOptions?.styleClass)}set styleClass(e){this._styleClass=e}get contentStyle(){return je.merge(this._contentStyle,this.modal?this.overlayResponsiveOptions?.contentStyle:this.overlayOptions?.contentStyle)}set contentStyle(e){this._contentStyle=e}get contentStyleClass(){return je.merge(this._contentStyleClass,this.modal?this.overlayResponsiveOptions?.contentStyleClass:this.overlayOptions?.contentStyleClass)}set contentStyleClass(e){this._contentStyleClass=e}get target(){let e=this._target||this.overlayOptions?.target;return e===void 0?"@prev":e}set target(e){this._target=e}get autoZIndex(){let e=this._autoZIndex||this.overlayOptions?.autoZIndex;return e===void 0?!0:e}set autoZIndex(e){this._autoZIndex=e}get baseZIndex(){let e=this._baseZIndex||this.overlayOptions?.baseZIndex;return e===void 0?0:e}set baseZIndex(e){this._baseZIndex=e}get showTransitionOptions(){let e=this._showTransitionOptions||this.overlayOptions?.showTransitionOptions;return e===void 0?".12s cubic-bezier(0, 0, 0.2, 1)":e}set showTransitionOptions(e){this._showTransitionOptions=e}get hideTransitionOptions(){let e=this._hideTransitionOptions||this.overlayOptions?.hideTransitionOptions;return e===void 0?".1s linear":e}set hideTransitionOptions(e){this._hideTransitionOptions=e}get listener(){return this._listener||this.overlayOptions?.listener}set listener(e){this._listener=e}get responsive(){return this._responsive||this.overlayOptions?.responsive}set responsive(e){this._responsive=e}get options(){return this._options}set options(e){this._options=e}appendTo=z(void 0);visibleChange=new S;onBeforeShow=new S;onShow=new S;onBeforeHide=new S;onHide=new S;onAnimationStart=new S;onAnimationDone=new S;overlayViewChild;contentViewChild;contentTemplate;templates;hostAttrSelector=z();$appendTo=re(()=>this.appendTo()||this.config.overlayAppendTo());_contentTemplate;_visible=!1;_mode;_style;_styleClass;_contentStyle;_contentStyleClass;_target;_autoZIndex;_baseZIndex;_showTransitionOptions;_hideTransitionOptions;_listener;_responsive;_options;modalVisible=!1;isOverlayClicked=!1;isOverlayContentClicked=!1;scrollHandler;documentClickListener;documentResizeListener;_componentStyle=_(gi);bindDirectiveInstance=_(O,{self:!0});documentKeyboardListener;window;transformOptions={default:"scaleY(0.8)",center:"scale(0.7)",top:"translate3d(0px, -100%, 0px)","top-start":"translate3d(0px, -100%, 0px)","top-end":"translate3d(0px, -100%, 0px)",bottom:"translate3d(0px, 100%, 0px)","bottom-start":"translate3d(0px, 100%, 0px)","bottom-end":"translate3d(0px, 100%, 0px)",left:"translate3d(-100%, 0px, 0px)","left-start":"translate3d(-100%, 0px, 0px)","left-end":"translate3d(-100%, 0px, 0px)",right:"translate3d(100%, 0px, 0px)","right-start":"translate3d(100%, 0px, 0px)","right-end":"translate3d(100%, 0px, 0px)"};get modal(){if(Se(this.platformId))return this.mode==="modal"||this.overlayResponsiveOptions&&this.document.defaultView?.matchMedia(this.overlayResponsiveOptions.media?.replace("@media","")||`(max-width: ${this.overlayResponsiveOptions.breakpoint})`).matches}get overlayMode(){return this.mode||(this.modal?"modal":"overlay")}get overlayOptions(){return A(A({},this.config?.overlayOptions),this.options)}get overlayResponsiveOptions(){return A(A({},this.overlayOptions?.responsive),this.responsive)}get overlayResponsiveDirection(){return this.overlayResponsiveOptions?.direction||"center"}get overlayEl(){return this.overlayViewChild?.nativeElement}get contentEl(){return this.contentViewChild?.nativeElement}get targetEl(){return Kt(this.target,this.el?.nativeElement)}constructor(e,i){super(),this.overlayService=e,this.zone=i}onAfterContentInit(){this.templates?.forEach(e=>{e.getType()==="content"?this._contentTemplate=e.template:this._contentTemplate=e.template})}onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptm("host"))}show(e,i=!1){this.onVisibleChange(!0),this.handleEvents("onShow",{overlay:e||this.overlayEl,target:this.targetEl,mode:this.overlayMode}),i&&J(this.targetEl),this.modal&&mt(this.document?.body,"p-overflow-hidden")}hide(e,i=!1){if(this.visible)this.onVisibleChange(!1),this.handleEvents("onHide",{overlay:e||this.overlayEl,target:this.targetEl,mode:this.overlayMode}),i&&J(this.targetEl),this.modal&&Qt(this.document?.body,"p-overflow-hidden");else return}alignOverlay(){!this.modal&&Je.alignOverlay(this.overlayEl,this.targetEl,this.$appendTo())}onVisibleChange(e){this._visible=e,this.visibleChange.emit(e)}onOverlayClick(){this.isOverlayClicked=!0}onOverlayContentClick(e){this.overlayService.add({originalEvent:e,target:this.targetEl}),this.isOverlayContentClicked=!0}onOverlayContentAnimationStart(e){switch(e.toState){case"visible":this.handleEvents("onBeforeShow",{overlay:this.overlayEl,target:this.targetEl,mode:this.overlayMode}),this.autoZIndex&&nt.set(this.overlayMode,this.overlayEl,this.baseZIndex+this.config?.zIndex[this.overlayMode]),this.hostAttrSelector()&&this.overlayEl&&this.overlayEl.setAttribute(this.hostAttrSelector(),""),Je.appendOverlay(this.overlayEl,this.$appendTo()==="body"?this.document.body:this.$appendTo(),this.$appendTo()),this.alignOverlay();break;case"void":this.handleEvents("onBeforeHide",{overlay:this.overlayEl,target:this.targetEl,mode:this.overlayMode}),this.modal&&mt(this.overlayEl,"p-overlay-mask-leave");break}this.handleEvents("onAnimationStart",e)}onOverlayContentAnimationDone(e){let i=this.overlayEl||e.element.parentElement;switch(e.toState){case"visible":this.visible&&(this.show(i,!0),this.bindListeners());break;case"void":if(!this.visible){this.hide(i,!0),this.modalVisible=!1,this.unbindListeners(),Je.appendOverlay(this.overlayEl,this.targetEl,this.$appendTo()),nt.clear(i),this.cd.markForCheck();break}}this.handleEvents("onAnimationDone",e)}handleEvents(e,i){this[e].emit(i),this.options&&this.options[e]&&this.options[e](i),this.config?.overlayOptions&&(this.config?.overlayOptions)[e]&&(this.config?.overlayOptions)[e](i)}bindListeners(){this.bindScrollListener(),this.bindDocumentClickListener(),this.bindDocumentResizeListener(),this.bindDocumentKeyboardListener()}unbindListeners(){this.unbindScrollListener(),this.unbindDocumentClickListener(),this.unbindDocumentResizeListener(),this.unbindDocumentKeyboardListener()}bindScrollListener(){this.scrollHandler||(this.scrollHandler=new Wt(this.targetEl,e=>{(!this.listener||this.listener(e,{type:"scroll",mode:this.overlayMode,valid:!0}))&&this.hide(e,!0)})),this.scrollHandler.bindScrollListener()}unbindScrollListener(){this.scrollHandler&&this.scrollHandler.unbindScrollListener()}bindDocumentClickListener(){this.documentClickListener||(this.documentClickListener=this.renderer.listen(this.document,"click",e=>{let n=!(this.targetEl&&(this.targetEl.isSameNode(e.target)||!this.isOverlayClicked&&this.targetEl.contains(e.target)))&&!this.isOverlayContentClicked;(this.listener?this.listener(e,{type:"outside",mode:this.overlayMode,valid:e.which!==3&&n}):n)&&this.hide(e),this.isOverlayClicked=this.isOverlayContentClicked=!1}))}unbindDocumentClickListener(){this.documentClickListener&&(this.documentClickListener(),this.documentClickListener=null)}bindDocumentResizeListener(){this.documentResizeListener||(this.documentResizeListener=this.renderer.listen(this.document.defaultView,"resize",e=>{(this.listener?this.listener(e,{type:"resize",mode:this.overlayMode,valid:!ke()}):!ke())&&this.hide(e,!0)}))}unbindDocumentResizeListener(){this.documentResizeListener&&(this.documentResizeListener(),this.documentResizeListener=null)}bindDocumentKeyboardListener(){this.documentKeyboardListener||this.zone.runOutsideAngular(()=>{this.documentKeyboardListener=this.renderer.listen(this.document.defaultView,"keydown",e=>{if(this.overlayOptions.hideOnEscape===!1||e.code!=="Escape")return;(this.listener?this.listener(e,{type:"keydown",mode:this.overlayMode,valid:!ke()}):!ke())&&this.zone.run(()=>{this.hide(e,!0)})})})}unbindDocumentKeyboardListener(){this.documentKeyboardListener&&(this.documentKeyboardListener(),this.documentKeyboardListener=null)}onDestroy(){this.hide(this.overlayEl,!0),this.overlayEl&&this.$appendTo()!=="self"&&(this.renderer.appendChild(this.el.nativeElement,this.overlayEl),nt.clear(this.overlayEl)),this.scrollHandler&&(this.scrollHandler.destroy(),this.scrollHandler=null),this.unbindListeners()}static \u0275fac=function(i){return new(i||t)(fe(Xe),fe(he))};static \u0275cmp=Z({type:t,selectors:[["p-overlay"]],contentQueries:function(i,n,o){if(i&1&&(M(o,fi,4),M(o,ve,4)),i&2){let s;f(s=g())&&(n.contentTemplate=s.first),f(s=g())&&(n.templates=s)}},viewQuery:function(i,n){if(i&1&&(W(on,5),W(fi,5)),i&2){let o;f(o=g())&&(n.overlayViewChild=o.first),f(o=g())&&(n.contentViewChild=o.first)}},inputs:{hostName:"hostName",visible:"visible",mode:"mode",style:"style",styleClass:"styleClass",contentStyle:"contentStyle",contentStyleClass:"contentStyleClass",target:"target",autoZIndex:"autoZIndex",baseZIndex:"baseZIndex",showTransitionOptions:"showTransitionOptions",hideTransitionOptions:"hideTransitionOptions",listener:"listener",responsive:"responsive",options:"options",appendTo:[1,"appendTo"],hostAttrSelector:[1,"hostAttrSelector"]},outputs:{visibleChange:"visibleChange",onBeforeShow:"onBeforeShow",onShow:"onShow",onBeforeHide:"onBeforeHide",onHide:"onHide",onAnimationStart:"onAnimationStart",onAnimationDone:"onAnimationDone"},features:[Y([gi,{provide:_i,useExisting:t},{provide:te,useExisting:t}]),X([O]),$],ngContentSelectors:sn,decls:1,vars:1,consts:[["overlay",""],["content",""],[3,"class","pBind","click",4,"ngIf"],[3,"click","pBind"],[4,"ngTemplateOutlet","ngTemplateOutletContext"]],template:function(i,n){i&1&&(Le(),d(0,un,3,4,"div",2)),i&2&&a("ngIf",n.modalVisible)},dependencies:[ae,_e,ye,Q,O],encapsulation:2,data:{animation:[$t("overlayContentAnimation",[ct(":enter",[ut(fn)]),ct(":leave",[ut(gn)])])]},changeDetection:0})}return t})();var vi=["content"],_n=["item"],yn=["loader"],vn=["loadericon"],bn=["element"],xn=["*"],vt=(t,l)=>({$implicit:t,options:l}),wn=t=>({numCols:t}),wi=t=>({options:t}),Cn=()=>({styleClass:"p-virtualscroller-loading-icon"}),In=(t,l)=>({rows:t,columns:l});function Tn(t,l){t&1&&N(0)}function Sn(t,l){if(t&1&&(B(0),d(1,Tn,1,0,"ng-container",10),F()),t&2){let e=r(2);p(),a("ngTemplateOutlet",e.contentTemplate||e._contentTemplate)("ngTemplateOutletContext",me(2,vt,e.loadedItems,e.getContentOptions()))}}function On(t,l){t&1&&N(0)}function En(t,l){if(t&1&&(B(0),d(1,On,1,0,"ng-container",10),F()),t&2){let e=l.$implicit,i=l.index,n=r(3);p(),a("ngTemplateOutlet",n.itemTemplate||n._itemTemplate)("ngTemplateOutletContext",me(2,vt,e,n.getOptions(i)))}}function kn(t,l){if(t&1&&(y(0,"div",11,3),d(2,En,2,5,"ng-container",12),v()),t&2){let e=r(2);ge(e.contentStyle),h(e.cn(e.cx("content"),e.contentStyleClass)),a("pBind",e.ptm("content")),p(2),a("ngForOf",e.loadedItems)("ngForTrackBy",e._trackBy)}}function Vn(t,l){if(t&1&&se(0,"div",13),t&2){let e=r(2);h(e.cx("spacer")),a("ngStyle",e.spacerStyle)("pBind",e.ptm("spacer"))}}function Mn(t,l){t&1&&N(0)}function Ln(t,l){if(t&1&&(B(0),d(1,Mn,1,0,"ng-container",10),F()),t&2){let e=l.index,i=r(4);p(),a("ngTemplateOutlet",i.loaderTemplate||i._loaderTemplate)("ngTemplateOutletContext",P(4,wi,i.getLoaderOptions(e,i.both&&P(2,wn,i.numItemsInViewport.cols))))}}function An(t,l){if(t&1&&(B(0),d(1,Ln,2,6,"ng-container",14),F()),t&2){let e=r(3);p(),a("ngForOf",e.loaderArr)}}function Dn(t,l){t&1&&N(0)}function zn(t,l){if(t&1&&(B(0),d(1,Dn,1,0,"ng-container",10),F()),t&2){let e=r(4);p(),a("ngTemplateOutlet",e.loaderIconTemplate||e._loaderIconTemplate)("ngTemplateOutletContext",P(3,wi,We(2,Cn)))}}function Bn(t,l){if(t&1&&(ne(),se(0,"svg",15)),t&2){let e=r(4);h(e.cx("loadingIcon")),a("spin",!0)("pBind",e.ptm("loadingIcon"))}}function Fn(t,l){if(t&1&&d(0,zn,2,5,"ng-container",6)(1,Bn,1,4,"ng-template",null,5,G),t&2){let e=le(2),i=r(3);a("ngIf",i.loaderIconTemplate||i._loaderIconTemplate)("ngIfElse",e)}}function Rn(t,l){if(t&1&&(y(0,"div",11),d(1,An,2,1,"ng-container",6)(2,Fn,3,2,"ng-template",null,4,G),v()),t&2){let e=le(3),i=r(2);h(i.cx("loader")),a("pBind",i.ptm("loader")),p(),a("ngIf",i.loaderTemplate||i._loaderTemplate)("ngIfElse",e)}}function Nn(t,l){if(t&1){let e=D();B(0),y(1,"div",7,1),V("scroll",function(n){u(e);let o=r();return m(o.onContainerScroll(n))}),d(3,Sn,2,5,"ng-container",6)(4,kn,3,7,"ng-template",null,2,G)(6,Vn,1,4,"div",8)(7,Rn,4,5,"div",9),v(),F()}if(t&2){let e=le(5),i=r();p(),h(i.cn(i.cx("root"),i.styleClass)),a("ngStyle",i._style)("pBind",i.ptm("root")),k("id",i._id)("tabindex",i.tabindex),p(2),a("ngIf",i.contentTemplate||i._contentTemplate)("ngIfElse",e),p(3),a("ngIf",i._showSpacer),p(),a("ngIf",!i.loaderDisabled&&i._showLoader&&i.d_loading)}}function Pn(t,l){t&1&&N(0)}function jn(t,l){if(t&1&&(B(0),d(1,Pn,1,0,"ng-container",10),F()),t&2){let e=r(2);p(),a("ngTemplateOutlet",e.contentTemplate||e._contentTemplate)("ngTemplateOutletContext",me(5,vt,e.items,me(2,In,e._items,e.loadedColumns)))}}function Hn(t,l){if(t&1&&(Ae(0),d(1,jn,2,8,"ng-container",16)),t&2){let e=r();p(),a("ngIf",e.contentTemplate||e._contentTemplate)}}var $n=`
.p-virtualscroller {
    position: relative;
    overflow: auto;
    contain: strict;
    transform: translateZ(0);
    will-change: scroll-position;
    outline: 0 none;
}

.p-virtualscroller-content {
    position: absolute;
    top: 0;
    left: 0;
    min-height: 100%;
    min-width: 100%;
    will-change: transform;
}

.p-virtualscroller-spacer {
    position: absolute;
    top: 0;
    left: 0;
    height: 1px;
    width: 1px;
    transform-origin: 0 0;
    pointer-events: none;
}

.p-virtualscroller-loader {
    position: sticky;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: dt('virtualscroller.loader.mask.background');
    color: dt('virtualscroller.loader.mask.color');
}

.p-virtualscroller-loader-mask {
    display: flex;
    align-items: center;
    justify-content: center;
}

.p-virtualscroller-loading-icon {
    font-size: dt('virtualscroller.loader.icon.size');
    width: dt('virtualscroller.loader.icon.size');
    height: dt('virtualscroller.loader.icon.size');
}

.p-virtualscroller-horizontal > .p-virtualscroller-content {
    display: flex;
}

.p-virtualscroller-inline .p-virtualscroller-content {
    position: static;
}
`,Qn={root:({instance:t})=>["p-virtualscroller",{"p-virtualscroller-inline":t.inline,"p-virtualscroller-both p-both-scroll":t.both,"p-virtualscroller-horizontal p-horizontal-scroll":t.horizontal}],content:"p-virtualscroller-content",spacer:"p-virtualscroller-spacer",loader:({instance:t})=>["p-virtualscroller-loader",{"p-virtualscroller-loader-mask":!t.loaderTemplate}],loadingIcon:"p-virtualscroller-loading-icon"},bi=(()=>{class t extends ee{name="virtualscroller";css=$n;classes=Qn;static \u0275fac=(()=>{let e;return function(n){return(e||(e=R(t)))(n||t)}})();static \u0275prov=T({token:t,factory:t.\u0275fac})}return t})();var xi=new U("SCROLLER_INSTANCE"),Ci=(()=>{class t extends be{zone;componentName="virtualScroller";bindDirectiveInstance=_(O,{self:!0});$pcScroller=_(xi,{optional:!0,skipSelf:!0})??void 0;hostName="";get id(){return this._id}set id(e){this._id=e}get style(){return this._style}set style(e){this._style=e}get styleClass(){return this._styleClass}set styleClass(e){this._styleClass=e}get tabindex(){return this._tabindex}set tabindex(e){this._tabindex=e}get items(){return this._items}set items(e){this._items=e}get itemSize(){return this._itemSize}set itemSize(e){this._itemSize=e}get scrollHeight(){return this._scrollHeight}set scrollHeight(e){this._scrollHeight=e}get scrollWidth(){return this._scrollWidth}set scrollWidth(e){this._scrollWidth=e}get orientation(){return this._orientation}set orientation(e){this._orientation=e}get step(){return this._step}set step(e){this._step=e}get delay(){return this._delay}set delay(e){this._delay=e}get resizeDelay(){return this._resizeDelay}set resizeDelay(e){this._resizeDelay=e}get appendOnly(){return this._appendOnly}set appendOnly(e){this._appendOnly=e}get inline(){return this._inline}set inline(e){this._inline=e}get lazy(){return this._lazy}set lazy(e){this._lazy=e}get disabled(){return this._disabled}set disabled(e){this._disabled=e}get loaderDisabled(){return this._loaderDisabled}set loaderDisabled(e){this._loaderDisabled=e}get columns(){return this._columns}set columns(e){this._columns=e}get showSpacer(){return this._showSpacer}set showSpacer(e){this._showSpacer=e}get showLoader(){return this._showLoader}set showLoader(e){this._showLoader=e}get numToleratedItems(){return this._numToleratedItems}set numToleratedItems(e){this._numToleratedItems=e}get loading(){return this._loading}set loading(e){this._loading=e}get autoSize(){return this._autoSize}set autoSize(e){this._autoSize=e}get trackBy(){return this._trackBy}set trackBy(e){this._trackBy=e}get options(){return this._options}set options(e){this._options=e,e&&typeof e=="object"&&(Object.entries(e).forEach(([i,n])=>this[`_${i}`]!==n&&(this[`_${i}`]=n)),Object.entries(e).forEach(([i,n])=>this[`${i}`]!==n&&(this[`${i}`]=n)))}onLazyLoad=new S;onScroll=new S;onScrollIndexChange=new S;elementViewChild;contentViewChild;height;_id;_style;_styleClass;_tabindex=0;_items;_itemSize=0;_scrollHeight;_scrollWidth;_orientation="vertical";_step=0;_delay=0;_resizeDelay=10;_appendOnly=!1;_inline=!1;_lazy=!1;_disabled=!1;_loaderDisabled=!1;_columns;_showSpacer=!0;_showLoader=!1;_numToleratedItems;_loading;_autoSize=!1;_trackBy;_options;d_loading=!1;d_numToleratedItems;contentEl;contentTemplate;itemTemplate;loaderTemplate;loaderIconTemplate;templates;_contentTemplate;_itemTemplate;_loaderTemplate;_loaderIconTemplate;first=0;last=0;page=0;isRangeChanged=!1;numItemsInViewport=0;lastScrollPos=0;lazyLoadState={};loaderArr=[];spacerStyle={};contentStyle={};scrollTimeout;resizeTimeout;initialized=!1;windowResizeListener;defaultWidth;defaultHeight;defaultContentWidth;defaultContentHeight;_contentStyleClass;get contentStyleClass(){return this._contentStyleClass}set contentStyleClass(e){this._contentStyleClass=e}get vertical(){return this._orientation==="vertical"}get horizontal(){return this._orientation==="horizontal"}get both(){return this._orientation==="both"}get loadedItems(){return this._items&&!this.d_loading?this.both?this._items.slice(this._appendOnly?0:this.first.rows,this.last.rows).map(e=>this._columns?e:Array.isArray(e)?e.slice(this._appendOnly?0:this.first.cols,this.last.cols):e):this.horizontal&&this._columns?this._items:this._items.slice(this._appendOnly?0:this.first,this.last):[]}get loadedRows(){return this.d_loading?this._loaderDisabled?this.loaderArr:[]:this.loadedItems}get loadedColumns(){return this._columns&&(this.both||this.horizontal)?this.d_loading&&this._loaderDisabled?this.both?this.loaderArr[0]:this.loaderArr:this._columns.slice(this.both?this.first.cols:this.first,this.both?this.last.cols:this.last):this._columns}_componentStyle=_(bi);constructor(e){super(),this.zone=e}onInit(){this.setInitialState()}onChanges(e){let i=!1;if(this.scrollHeight=="100%"&&(this.height="100%"),e.loading){let{previousValue:n,currentValue:o}=e.loading;this.lazy&&n!==o&&o!==this.d_loading&&(this.d_loading=o,i=!0)}if(e.orientation&&(this.lastScrollPos=this.both?{top:0,left:0}:0),e.numToleratedItems){let{previousValue:n,currentValue:o}=e.numToleratedItems;n!==o&&o!==this.d_numToleratedItems&&(this.d_numToleratedItems=o)}if(e.options){let{previousValue:n,currentValue:o}=e.options;this.lazy&&n?.loading!==o?.loading&&o?.loading!==this.d_loading&&(this.d_loading=o.loading,i=!0),n?.numToleratedItems!==o?.numToleratedItems&&o?.numToleratedItems!==this.d_numToleratedItems&&(this.d_numToleratedItems=o.numToleratedItems)}this.initialized&&!i&&(e.items?.previousValue?.length!==e.items?.currentValue?.length||e.itemSize||e.scrollHeight||e.scrollWidth)&&(this.init(),this.calculateAutoSize())}onAfterContentInit(){this.templates.forEach(e=>{switch(e.getType()){case"content":this._contentTemplate=e.template;break;case"item":this._itemTemplate=e.template;break;case"loader":this._loaderTemplate=e.template;break;case"loadericon":this._loaderIconTemplate=e.template;break;default:this._itemTemplate=e.template;break}})}onAfterViewInit(){Promise.resolve().then(()=>{this.viewInit()})}onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptm("host")),this.initialized||this.viewInit()}onDestroy(){this.unbindResizeListener(),this.contentEl=null,this.initialized=!1}viewInit(){Se(this.platformId)&&!this.initialized&&ht(this.elementViewChild?.nativeElement)&&(this.setInitialState(),this.setContentEl(this.contentEl),this.init(),this.defaultWidth=Ee(this.elementViewChild?.nativeElement),this.defaultHeight=Oe(this.elementViewChild?.nativeElement),this.defaultContentWidth=Ee(this.contentEl),this.defaultContentHeight=Oe(this.contentEl),this.initialized=!0)}init(){this._disabled||(this.bindResizeListener(),setTimeout(()=>{this.setSpacerSize(),this.setSize(),this.calculateOptions(),this.cd.detectChanges()},1))}setContentEl(e){this.contentEl=e||this.contentViewChild?.nativeElement||ze(this.elementViewChild?.nativeElement,".p-virtualscroller-content")}setInitialState(){this.first=this.both?{rows:0,cols:0}:0,this.last=this.both?{rows:0,cols:0}:0,this.numItemsInViewport=this.both?{rows:0,cols:0}:0,this.lastScrollPos=this.both?{top:0,left:0}:0,(this.d_loading===void 0||this.d_loading===!1)&&(this.d_loading=this._loading||!1),this.d_numToleratedItems=this._numToleratedItems,this.loaderArr=this.loaderArr.length>0?this.loaderArr:[]}getElementRef(){return this.elementViewChild}getPageByFirst(e){return Math.floor(((e??this.first)+this.d_numToleratedItems*4)/(this._step||1))}isPageChanged(e){return this._step?this.page!==this.getPageByFirst(e??this.first):!0}scrollTo(e){this.elementViewChild?.nativeElement?.scrollTo(e)}scrollToIndex(e,i="auto"){if(this.both?e.every(o=>o>-1):e>-1){let o=this.first,{scrollTop:s=0,scrollLeft:c=0}=this.elementViewChild?.nativeElement,{numToleratedItems:x}=this.calculateNumItems(),b=this.getContentPosition(),w=this.itemSize,j=(E=0,L)=>E<=L?0:E,H=(E,L,ie)=>E*L+ie,oe=(E=0,L=0)=>this.scrollTo({left:E,top:L,behavior:i}),q=this.both?{rows:0,cols:0}:0,xe=!1,C=!1;this.both?(q={rows:j(e[0],x[0]),cols:j(e[1],x[1])},oe(H(q.cols,w[1],b.left),H(q.rows,w[0],b.top)),C=this.lastScrollPos.top!==s||this.lastScrollPos.left!==c,xe=q.rows!==o.rows||q.cols!==o.cols):(q=j(e,x),this.horizontal?oe(H(q,w,b.left),s):oe(c,H(q,w,b.top)),C=this.lastScrollPos!==(this.horizontal?c:s),xe=q!==o),this.isRangeChanged=xe,C&&(this.first=q)}}scrollInView(e,i,n="auto"){if(i){let{first:o,viewport:s}=this.getRenderedRange(),c=(w=0,j=0)=>this.scrollTo({left:w,top:j,behavior:n}),x=i==="to-start",b=i==="to-end";if(x){if(this.both)s.first.rows-o.rows>e[0]?c(s.first.cols*this._itemSize[1],(s.first.rows-1)*this._itemSize[0]):s.first.cols-o.cols>e[1]&&c((s.first.cols-1)*this._itemSize[1],s.first.rows*this._itemSize[0]);else if(s.first-o>e){let w=(s.first-1)*this._itemSize;this.horizontal?c(w,0):c(0,w)}}else if(b){if(this.both)s.last.rows-o.rows<=e[0]+1?c(s.first.cols*this._itemSize[1],(s.first.rows+1)*this._itemSize[0]):s.last.cols-o.cols<=e[1]+1&&c((s.first.cols+1)*this._itemSize[1],s.first.rows*this._itemSize[0]);else if(s.last-o<=e+1){let w=(s.first+1)*this._itemSize;this.horizontal?c(w,0):c(0,w)}}}else this.scrollToIndex(e,n)}getRenderedRange(){let e=(o,s)=>s||o?Math.floor(o/(s||o)):0,i=this.first,n=0;if(this.elementViewChild?.nativeElement){let{scrollTop:o,scrollLeft:s}=this.elementViewChild.nativeElement;if(this.both)i={rows:e(o,this._itemSize[0]),cols:e(s,this._itemSize[1])},n={rows:i.rows+this.numItemsInViewport.rows,cols:i.cols+this.numItemsInViewport.cols};else{let c=this.horizontal?s:o;i=e(c,this._itemSize),n=i+this.numItemsInViewport}}return{first:this.first,last:this.last,viewport:{first:i,last:n}}}calculateNumItems(){let e=this.getContentPosition(),i=(this.elementViewChild?.nativeElement?this.elementViewChild.nativeElement.offsetWidth-e.left:0)||0,n=(this.elementViewChild?.nativeElement?this.elementViewChild.nativeElement.offsetHeight-e.top:0)||0,o=(b,w)=>w||b?Math.ceil(b/(w||b)):0,s=b=>Math.ceil(b/2),c=this.both?{rows:o(n,this._itemSize[0]),cols:o(i,this._itemSize[1])}:o(this.horizontal?i:n,this._itemSize),x=this.d_numToleratedItems||(this.both?[s(c.rows),s(c.cols)]:s(c));return{numItemsInViewport:c,numToleratedItems:x}}calculateOptions(){let{numItemsInViewport:e,numToleratedItems:i}=this.calculateNumItems(),n=(c,x,b,w=!1)=>this.getLast(c+x+(c<b?2:3)*b,w),o=this.first,s=this.both?{rows:n(this.first.rows,e.rows,i[0]),cols:n(this.first.cols,e.cols,i[1],!0)}:n(this.first,e,i);this.last=s,this.numItemsInViewport=e,this.d_numToleratedItems=i,this._showLoader&&(this.loaderArr=this.both?Array.from({length:e.rows}).map(()=>Array.from({length:e.cols})):Array.from({length:e})),this._lazy&&Promise.resolve().then(()=>{this.lazyLoadState={first:this._step?this.both?{rows:0,cols:o.cols}:0:o,last:Math.min(this._step?this._step:this.last,this._items.length)},this.handleEvents("onLazyLoad",this.lazyLoadState)})}calculateAutoSize(){this._autoSize&&!this.d_loading&&Promise.resolve().then(()=>{if(this.contentEl){this.contentEl.style.minHeight=this.contentEl.style.minWidth="auto",this.contentEl.style.position="relative",this.elementViewChild.nativeElement.style.contain="none";let[e,i]=[Ee(this.contentEl),Oe(this.contentEl)];e!==this.defaultContentWidth&&(this.elementViewChild.nativeElement.style.width=""),i!==this.defaultContentHeight&&(this.elementViewChild.nativeElement.style.height="");let[n,o]=[Ee(this.elementViewChild.nativeElement),Oe(this.elementViewChild.nativeElement)];(this.both||this.horizontal)&&(this.elementViewChild.nativeElement.style.width=n<this.defaultWidth?n+"px":this._scrollWidth||this.defaultWidth+"px"),(this.both||this.vertical)&&(this.elementViewChild.nativeElement.style.height=o<this.defaultHeight?o+"px":this._scrollHeight||this.defaultHeight+"px"),this.contentEl.style.minHeight=this.contentEl.style.minWidth="",this.contentEl.style.position="",this.elementViewChild.nativeElement.style.contain=""}})}getLast(e=0,i=!1){return this._items?Math.min(i?(this._columns||this._items[0]).length:this._items.length,e):0}getContentPosition(){if(this.contentEl){let e=getComputedStyle(this.contentEl),i=parseFloat(e.paddingLeft)+Math.max(parseFloat(e.left)||0,0),n=parseFloat(e.paddingRight)+Math.max(parseFloat(e.right)||0,0),o=parseFloat(e.paddingTop)+Math.max(parseFloat(e.top)||0,0),s=parseFloat(e.paddingBottom)+Math.max(parseFloat(e.bottom)||0,0);return{left:i,right:n,top:o,bottom:s,x:i+n,y:o+s}}return{left:0,right:0,top:0,bottom:0,x:0,y:0}}setSize(){if(this.elementViewChild?.nativeElement){let e=this.elementViewChild.nativeElement,i=e.parentElement?.parentElement,n=e.offsetWidth,o=i?.offsetWidth||0,s=this._scrollWidth||`${n||o}px`,c=e.offsetHeight,x=i?.offsetHeight||0,b=this._scrollHeight||`${c||x}px`,w=(j,H)=>e.style[j]=H;this.both||this.horizontal?(w("height",b),w("width",s)):w("height",b)}}setSpacerSize(){if(this._items){let e=this.getContentPosition(),i=(n,o,s,c=0)=>this.spacerStyle=Me(A({},this.spacerStyle),{[`${n}`]:(o||[]).length*s+c+"px"});this.both?(i("height",this._items,this._itemSize[0],e.y),i("width",this._columns||this._items[1],this._itemSize[1],e.x)):this.horizontal?i("width",this._columns||this._items,this._itemSize,e.x):i("height",this._items,this._itemSize,e.y)}}setContentPosition(e){if(this.contentEl&&!this._appendOnly){let i=e?e.first:this.first,n=(s,c)=>s*c,o=(s=0,c=0)=>this.contentStyle=Me(A({},this.contentStyle),{transform:`translate3d(${s}px, ${c}px, 0)`});if(this.both)o(n(i.cols,this._itemSize[1]),n(i.rows,this._itemSize[0]));else{let s=n(i,this._itemSize);this.horizontal?o(s,0):o(0,s)}}}onScrollPositionChange(e){let i=e.target;if(!i)throw new Error("Event target is null");let n=this.getContentPosition(),o=(C,E)=>C?C>E?C-E:C:0,s=(C,E)=>E||C?Math.floor(C/(E||C)):0,c=(C,E,L,ie,pe,we)=>C<=pe?pe:we?L-ie-pe:E+pe-1,x=(C,E,L,ie,pe,we,$e)=>C<=we?0:Math.max(0,$e?C<E?L:C-we:C>E?L:C-2*we),b=(C,E,L,ie,pe,we=!1)=>{let $e=E+ie+2*pe;return C>=pe&&($e+=pe+1),this.getLast($e,we)},w=o(i.scrollTop,n.top),j=o(i.scrollLeft,n.left),H=this.both?{rows:0,cols:0}:0,oe=this.last,q=!1,xe=this.lastScrollPos;if(this.both){let C=this.lastScrollPos.top<=w,E=this.lastScrollPos.left<=j;if(!this._appendOnly||this._appendOnly&&(C||E)){let L={rows:s(w,this._itemSize[0]),cols:s(j,this._itemSize[1])},ie={rows:c(L.rows,this.first.rows,this.last.rows,this.numItemsInViewport.rows,this.d_numToleratedItems[0],C),cols:c(L.cols,this.first.cols,this.last.cols,this.numItemsInViewport.cols,this.d_numToleratedItems[1],E)};H={rows:x(L.rows,ie.rows,this.first.rows,this.last.rows,this.numItemsInViewport.rows,this.d_numToleratedItems[0],C),cols:x(L.cols,ie.cols,this.first.cols,this.last.cols,this.numItemsInViewport.cols,this.d_numToleratedItems[1],E)},oe={rows:b(L.rows,H.rows,this.last.rows,this.numItemsInViewport.rows,this.d_numToleratedItems[0]),cols:b(L.cols,H.cols,this.last.cols,this.numItemsInViewport.cols,this.d_numToleratedItems[1],!0)},q=H.rows!==this.first.rows||oe.rows!==this.last.rows||H.cols!==this.first.cols||oe.cols!==this.last.cols||this.isRangeChanged,xe={top:w,left:j}}}else{let C=this.horizontal?j:w,E=this.lastScrollPos<=C;if(!this._appendOnly||this._appendOnly&&E){let L=s(C,this._itemSize),ie=c(L,this.first,this.last,this.numItemsInViewport,this.d_numToleratedItems,E);H=x(L,ie,this.first,this.last,this.numItemsInViewport,this.d_numToleratedItems,E),oe=b(L,H,this.last,this.numItemsInViewport,this.d_numToleratedItems),q=H!==this.first||oe!==this.last||this.isRangeChanged,xe=C}}return{first:H,last:oe,isRangeChanged:q,scrollPos:xe}}onScrollChange(e){let{first:i,last:n,isRangeChanged:o,scrollPos:s}=this.onScrollPositionChange(e);if(o){let c={first:i,last:n};if(this.setContentPosition(c),this.first=i,this.last=n,this.lastScrollPos=s,this.handleEvents("onScrollIndexChange",c),this._lazy&&this.isPageChanged(i)){let x={first:this._step?Math.min(this.getPageByFirst(i)*this._step,this._items.length-this._step):i,last:Math.min(this._step?(this.getPageByFirst(i)+1)*this._step:n,this._items.length)};(this.lazyLoadState.first!==x.first||this.lazyLoadState.last!==x.last)&&this.handleEvents("onLazyLoad",x),this.lazyLoadState=x}}}onContainerScroll(e){if(this.handleEvents("onScroll",{originalEvent:e}),this._delay){if(this.scrollTimeout&&clearTimeout(this.scrollTimeout),!this.d_loading&&this._showLoader){let{isRangeChanged:i}=this.onScrollPositionChange(e);(i||this._step&&this.isPageChanged())&&(this.d_loading=!0,this.cd.detectChanges())}this.scrollTimeout=setTimeout(()=>{this.onScrollChange(e),this.d_loading&&this._showLoader&&(!this._lazy||this._loading===void 0)&&(this.d_loading=!1,this.page=this.getPageByFirst()),this.cd.detectChanges()},this._delay)}else!this.d_loading&&this.onScrollChange(e)}bindResizeListener(){Se(this.platformId)&&(this.windowResizeListener||this.zone.runOutsideAngular(()=>{let e=this.document.defaultView,i=ke()?"orientationchange":"resize";this.windowResizeListener=this.renderer.listen(e,i,this.onWindowResize.bind(this))}))}unbindResizeListener(){this.windowResizeListener&&(this.windowResizeListener(),this.windowResizeListener=null)}onWindowResize(){this.resizeTimeout&&clearTimeout(this.resizeTimeout),this.resizeTimeout=setTimeout(()=>{if(ht(this.elementViewChild?.nativeElement)){let[e,i]=[Ee(this.elementViewChild?.nativeElement),Oe(this.elementViewChild?.nativeElement)],[n,o]=[e!==this.defaultWidth,i!==this.defaultHeight];(this.both?n||o:this.horizontal?n:this.vertical&&o)&&this.zone.run(()=>{this.d_numToleratedItems=this._numToleratedItems,this.defaultWidth=e,this.defaultHeight=i,this.defaultContentWidth=Ee(this.contentEl),this.defaultContentHeight=Oe(this.contentEl),this.init()})}},this._resizeDelay)}handleEvents(e,i){return this.options&&this.options[e]?this.options[e](i):this[e].emit(i)}getContentOptions(){return{contentStyleClass:`p-virtualscroller-content ${this.d_loading?"p-virtualscroller-loading":""}`,items:this.loadedItems,getItemOptions:e=>this.getOptions(e),loading:this.d_loading,getLoaderOptions:(e,i)=>this.getLoaderOptions(e,i),itemSize:this._itemSize,rows:this.loadedRows,columns:this.loadedColumns,spacerStyle:this.spacerStyle,contentStyle:this.contentStyle,vertical:this.vertical,horizontal:this.horizontal,both:this.both,scrollTo:this.scrollTo.bind(this),scrollToIndex:this.scrollToIndex.bind(this),orientation:this._orientation,scrollableElement:this.elementViewChild?.nativeElement}}getOptions(e){let i=(this._items||[]).length,n=this.both?this.first.rows+e:this.first+e;return{index:n,count:i,first:n===0,last:n===i-1,even:n%2===0,odd:n%2!==0}}getLoaderOptions(e,i){let n=this.loaderArr.length;return A({index:e,count:n,first:e===0,last:e===n-1,even:e%2===0,odd:e%2!==0,loading:this.d_loading},i)}static \u0275fac=function(i){return new(i||t)(fe(he))};static \u0275cmp=Z({type:t,selectors:[["p-scroller"],["p-virtualscroller"],["p-virtual-scroller"],["p-virtualScroller"]],contentQueries:function(i,n,o){if(i&1&&(M(o,vi,4),M(o,_n,4),M(o,yn,4),M(o,vn,4),M(o,ve,4)),i&2){let s;f(s=g())&&(n.contentTemplate=s.first),f(s=g())&&(n.itemTemplate=s.first),f(s=g())&&(n.loaderTemplate=s.first),f(s=g())&&(n.loaderIconTemplate=s.first),f(s=g())&&(n.templates=s)}},viewQuery:function(i,n){if(i&1&&(W(bn,5),W(vi,5)),i&2){let o;f(o=g())&&(n.elementViewChild=o.first),f(o=g())&&(n.contentViewChild=o.first)}},hostVars:2,hostBindings:function(i,n){i&2&&De("height",n.height)},inputs:{hostName:"hostName",id:"id",style:"style",styleClass:"styleClass",tabindex:"tabindex",items:"items",itemSize:"itemSize",scrollHeight:"scrollHeight",scrollWidth:"scrollWidth",orientation:"orientation",step:"step",delay:"delay",resizeDelay:"resizeDelay",appendOnly:"appendOnly",inline:"inline",lazy:"lazy",disabled:"disabled",loaderDisabled:"loaderDisabled",columns:"columns",showSpacer:"showSpacer",showLoader:"showLoader",numToleratedItems:"numToleratedItems",loading:"loading",autoSize:"autoSize",trackBy:"trackBy",options:"options"},outputs:{onLazyLoad:"onLazyLoad",onScroll:"onScroll",onScrollIndexChange:"onScrollIndexChange"},features:[Y([bi,{provide:xi,useExisting:t},{provide:te,useExisting:t}]),X([O]),$],ngContentSelectors:xn,decls:3,vars:2,consts:[["disabledContainer",""],["element",""],["buildInContent",""],["content",""],["buildInLoader",""],["buildInLoaderIcon",""],[4,"ngIf","ngIfElse"],[3,"scroll","ngStyle","pBind"],[3,"class","ngStyle","pBind",4,"ngIf"],[3,"class","pBind",4,"ngIf"],[4,"ngTemplateOutlet","ngTemplateOutletContext"],[3,"pBind"],[4,"ngFor","ngForOf","ngForTrackBy"],[3,"ngStyle","pBind"],[4,"ngFor","ngForOf"],["data-p-icon","spinner",3,"spin","pBind"],[4,"ngIf"]],template:function(i,n){if(i&1&&(Le(),d(0,Nn,8,10,"ng-container",6)(1,Hn,2,1,"ng-template",null,0,G)),i&2){let o=le(2);a("ngIf",!n._disabled)("ngIfElse",o)}},dependencies:[ae,Ue,_e,ye,Ze,tt,Q,O],encapsulation:2})}return t})();var Ii=`
    .p-autocomplete {
        display: inline-flex;
    }

    .p-autocomplete-loader {
        position: absolute;
        top: 50%;
        margin-top: -0.5rem;
        inset-inline-end: dt('autocomplete.padding.x');
    }

    .p-autocomplete:has(.p-autocomplete-dropdown) .p-autocomplete-loader {
        inset-inline-end: calc(dt('autocomplete.dropdown.width') + dt('autocomplete.padding.x'));
    }

    .p-autocomplete:has(.p-autocomplete-dropdown) .p-autocomplete-input {
        flex: 1 1 auto;
        width: 1%;
    }

    .p-autocomplete:has(.p-autocomplete-dropdown) .p-autocomplete-input,
    .p-autocomplete:has(.p-autocomplete-dropdown) .p-autocomplete-input-multiple {
        border-start-end-radius: 0;
        border-end-end-radius: 0;
    }

    .p-autocomplete-dropdown {
        cursor: pointer;
        display: inline-flex;
        user-select: none;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        position: relative;
        width: dt('autocomplete.dropdown.width');
        border-start-end-radius: dt('autocomplete.dropdown.border.radius');
        border-end-end-radius: dt('autocomplete.dropdown.border.radius');
        background: dt('autocomplete.dropdown.background');
        border: 1px solid dt('autocomplete.dropdown.border.color');
        border-inline-start: 0 none;
        color: dt('autocomplete.dropdown.color');
        transition:
            background dt('autocomplete.transition.duration'),
            color dt('autocomplete.transition.duration'),
            border-color dt('autocomplete.transition.duration'),
            outline-color dt('autocomplete.transition.duration'),
            box-shadow dt('autocomplete.transition.duration');
        outline-color: transparent;
    }

    .p-autocomplete-dropdown:not(:disabled):hover {
        background: dt('autocomplete.dropdown.hover.background');
        border-color: dt('autocomplete.dropdown.hover.border.color');
        color: dt('autocomplete.dropdown.hover.color');
    }

    .p-autocomplete-dropdown:not(:disabled):active {
        background: dt('autocomplete.dropdown.active.background');
        border-color: dt('autocomplete.dropdown.active.border.color');
        color: dt('autocomplete.dropdown.active.color');
    }

    .p-autocomplete-dropdown:focus-visible {
        box-shadow: dt('autocomplete.dropdown.focus.ring.shadow');
        outline: dt('autocomplete.dropdown.focus.ring.width') dt('autocomplete.dropdown.focus.ring.style') dt('autocomplete.dropdown.focus.ring.color');
        outline-offset: dt('autocomplete.dropdown.focus.ring.offset');
    }

    .p-autocomplete-overlay {
        position: absolute;
        top: 0;
        left: 0;
        background: dt('autocomplete.overlay.background');
        color: dt('autocomplete.overlay.color');
        border: 1px solid dt('autocomplete.overlay.border.color');
        border-radius: dt('autocomplete.overlay.border.radius');
        box-shadow: dt('autocomplete.overlay.shadow');
        min-width: 100%;
    }

    .p-autocomplete-list-container {
        overflow: auto;
    }

    .p-autocomplete-list {
        margin: 0;
        list-style-type: none;
        display: flex;
        flex-direction: column;
        gap: dt('autocomplete.list.gap');
        padding: dt('autocomplete.list.padding');
    }

    .p-autocomplete-option {
        cursor: pointer;
        white-space: nowrap;
        position: relative;
        overflow: hidden;
        display: flex;
        align-items: center;
        padding: dt('autocomplete.option.padding');
        border: 0 none;
        color: dt('autocomplete.option.color');
        background: transparent;
        transition:
            background dt('autocomplete.transition.duration'),
            color dt('autocomplete.transition.duration'),
            border-color dt('autocomplete.transition.duration');
        border-radius: dt('autocomplete.option.border.radius');
    }

    .p-autocomplete-option:not(.p-autocomplete-option-selected):not(.p-disabled).p-focus {
        background: dt('autocomplete.option.focus.background');
        color: dt('autocomplete.option.focus.color');
    }

    .p-autocomplete-option-selected {
        background: dt('autocomplete.option.selected.background');
        color: dt('autocomplete.option.selected.color');
    }

    .p-autocomplete-option-selected.p-focus {
        background: dt('autocomplete.option.selected.focus.background');
        color: dt('autocomplete.option.selected.focus.color');
    }

    .p-autocomplete-option-group {
        margin: 0;
        padding: dt('autocomplete.option.group.padding');
        color: dt('autocomplete.option.group.color');
        background: dt('autocomplete.option.group.background');
        font-weight: dt('autocomplete.option.group.font.weight');
    }

    .p-autocomplete-input-multiple {
        margin: 0;
        list-style-type: none;
        cursor: text;
        overflow: hidden;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        padding: calc(dt('autocomplete.padding.y') / 2) dt('autocomplete.padding.x');
        gap: calc(dt('autocomplete.padding.y') / 2);
        color: dt('autocomplete.color');
        background: dt('autocomplete.background');
        border: 1px solid dt('autocomplete.border.color');
        border-radius: dt('autocomplete.border.radius');
        width: 100%;
        transition:
            background dt('autocomplete.transition.duration'),
            color dt('autocomplete.transition.duration'),
            border-color dt('autocomplete.transition.duration'),
            outline-color dt('autocomplete.transition.duration'),
            box-shadow dt('autocomplete.transition.duration');
        outline-color: transparent;
        box-shadow: dt('autocomplete.shadow');
    }

    .p-autocomplete-input-multiple.p-disabled {
        opacity: 1;
        background: dt('inputtext.disabled.background');
        color: dt('inputtext.disabled.color');
    }

    .p-autocomplete-input-multiple:not(.p-disabled):hover {
        border-color: dt('autocomplete.hover.border.color');
    }

    .p-autocomplete.p-focus .p-autocomplete-input-multiple:not(.p-disabled) {
        border-color: dt('autocomplete.focus.border.color');
        box-shadow: dt('autocomplete.focus.ring.shadow');
        outline: dt('autocomplete.focus.ring.width') dt('autocomplete.focus.ring.style') dt('autocomplete.focus.ring.color');
        outline-offset: dt('autocomplete.focus.ring.offset');
    }

    .p-autocomplete.p-invalid .p-autocomplete-input-multiple {
        border-color: dt('autocomplete.invalid.border.color');
    }

    .p-variant-filled.p-autocomplete-input-multiple {
        background: dt('autocomplete.filled.background');
    }

    .p-autocomplete-input-multiple.p-variant-filled:not(.p-disabled):hover {
        background: dt('autocomplete.filled.hover.background');
    }

    .p-autocomplete.p-focus .p-autocomplete-input-multiple.p-variant-filled:not(.p-disabled) {
        background: dt('autocomplete.filled.focus.background');
    }

    .p-autocomplete-chip.p-chip {
        padding-block-start: calc(dt('autocomplete.padding.y') / 2);
        padding-block-end: calc(dt('autocomplete.padding.y') / 2);
        border-radius: dt('autocomplete.chip.border.radius');
    }

    .p-autocomplete-input-multiple:has(.p-autocomplete-chip) {
        padding-inline-start: calc(dt('autocomplete.padding.y') / 2);
        padding-inline-end: calc(dt('autocomplete.padding.y') / 2);
    }

    .p-autocomplete-chip-item.p-focus .p-autocomplete-chip {
        background: dt('autocomplete.chip.focus.background');
        color: dt('autocomplete.chip.focus.color');
    }

    .p-autocomplete-input-chip {
        flex: 1 1 auto;
        display: inline-flex;
        padding-block-start: calc(dt('autocomplete.padding.y') / 2);
        padding-block-end: calc(dt('autocomplete.padding.y') / 2);
    }

    .p-autocomplete-input-chip input {
        border: 0 none;
        outline: 0 none;
        background: transparent;
        margin: 0;
        padding: 0;
        box-shadow: none;
        border-radius: 0;
        width: 100%;
        font-family: inherit;
        font-feature-settings: inherit;
        font-size: 1rem;
        color: inherit;
    }

    .p-autocomplete-input-chip input::placeholder {
        color: dt('autocomplete.placeholder.color');
    }

    .p-autocomplete.p-invalid .p-autocomplete-input-chip input::placeholder {
        color: dt('autocomplete.invalid.placeholder.color');
    }

    .p-autocomplete-empty-message {
        padding: dt('autocomplete.empty.message.padding');
    }

    .p-autocomplete-fluid {
        display: flex;
    }

    .p-autocomplete-fluid:has(.p-autocomplete-dropdown) .p-autocomplete-input {
        width: 1%;
    }

    .p-autocomplete:has(.p-inputtext-sm) .p-autocomplete-dropdown {
        width: dt('autocomplete.dropdown.sm.width');
    }

    .p-autocomplete:has(.p-inputtext-sm) .p-autocomplete-dropdown .p-icon {
        font-size: dt('form.field.sm.font.size');
        width: dt('form.field.sm.font.size');
        height: dt('form.field.sm.font.size');
    }

    .p-autocomplete:has(.p-inputtext-lg) .p-autocomplete-dropdown {
        width: dt('autocomplete.dropdown.lg.width');
    }

    .p-autocomplete:has(.p-inputtext-lg) .p-autocomplete-dropdown .p-icon {
        font-size: dt('form.field.lg.font.size');
        width: dt('form.field.lg.font.size');
        height: dt('form.field.lg.font.size');
    }

    .p-autocomplete-clear-icon {
        position: absolute;
        top: 50%;
        margin-top: -0.5rem;
        cursor: pointer;
        color: dt('form.field.icon.color');
        inset-inline-end: dt('autocomplete.padding.x');
    }

    .p-autocomplete:has(.p-autocomplete-dropdown) .p-autocomplete-clear-icon {
        inset-inline-end: calc(dt('autocomplete.padding.x') + dt('autocomplete.dropdown.width'));
    }

    .p-autocomplete:has(.p-autocomplete-clear-icon) .p-autocomplete-input {
        padding-inline-end: calc((dt('form.field.padding.x') * 2) + dt('icon.size'));
    }

    .p-inputgroup .p-autocomplete-dropdown {
        border-radius: 0;
    }

    .p-inputgroup > .p-autocomplete:last-child:has(.p-autocomplete-dropdown) > .p-autocomplete-input {
        border-start-end-radius: 0;
        border-end-end-radius: 0;
    }

    .p-inputgroup > .p-autocomplete:last-child .p-autocomplete-dropdown {
        border-start-end-radius: dt('autocomplete.dropdown.border.radius');
        border-end-end-radius: dt('autocomplete.dropdown.border.radius');
    }
`;var Kn=["item"],qn=["empty"],Wn=["header"],Gn=["footer"],Un=["selecteditem"],Zn=["group"],Xn=["loader"],Yn=["removeicon"],Jn=["loadingicon"],eo=["clearicon"],to=["dropdownicon"],io=["focusInput"],no=["multiIn"],oo=["multiContainer"],so=["ddBtn"],lo=["items"],ro=["scroller"],ao=["overlay"],po=t=>({i:t}),Oi=t=>({$implicit:t}),co=(t,l,e)=>({removeCallback:t,index:l,class:e}),ot=t=>({height:t}),Ei=(t,l)=>({$implicit:t,options:l}),uo=t=>({options:t}),mo=()=>({}),ho=(t,l,e)=>({option:t,i:l,scrollerOptions:e}),fo=(t,l)=>({$implicit:t,index:l});function go(t,l){if(t&1){let e=D();y(0,"input",18,2),V("input",function(n){u(e);let o=r();return m(o.onInput(n))})("keydown",function(n){u(e);let o=r();return m(o.onKeyDown(n))})("change",function(n){u(e);let o=r();return m(o.onInputChange(n))})("focus",function(n){u(e);let o=r();return m(o.onInputFocus(n))})("blur",function(n){u(e);let o=r();return m(o.onInputBlur(n))})("paste",function(n){u(e);let o=r();return m(o.onInputPaste(n))})("keyup",function(n){u(e);let o=r();return m(o.onInputKeyUp(n))}),v()}if(t&2){let e=r();h(e.cn(e.cx("pcInputText"),e.inputStyleClass)),a("pAutoFocus",e.autofocus)("pt",e.ptm("pcInputText"))("ngStyle",e.inputStyle)("variant",e.$variant())("invalid",e.invalid())("pSize",e.size())("fluid",e.hasFluid),k("type",e.type)("value",e.inputValue())("id",e.inputId)("autocomplete",e.autocomplete)("placeholder",e.placeholder)("name",e.name())("minlength",e.minlength())("min",e.min())("max",e.max())("pattern",e.pattern())("size",e.inputSize())("maxlength",e.maxlength())("tabindex",e.$disabled()?-1:e.tabindex)("required",e.required()?"":void 0)("readonly",e.readonly?"":void 0)("disabled",e.$disabled()?"":void 0)("aria-label",e.ariaLabel)("aria-labelledby",e.ariaLabelledBy)("aria-required",e.required())("aria-expanded",e.overlayVisible??!1)("aria-controls",e.overlayVisible?e.id+"_list":null)("aria-activedescendant",e.focused?e.focusedOptionId:void 0)}}function _o(t,l){if(t&1){let e=D();ne(),y(0,"svg",21),V("click",function(){u(e);let n=r(2);return m(n.clear())}),v()}if(t&2){let e=r(2);h(e.cx("clearIcon")),a("pBind",e.ptm("clearIcon")),k("aria-hidden",!0)}}function yo(t,l){}function vo(t,l){t&1&&d(0,yo,0,0,"ng-template")}function bo(t,l){if(t&1){let e=D();y(0,"span",22),V("click",function(){u(e);let n=r(2);return m(n.clear())}),d(1,vo,1,0,null,23),v()}if(t&2){let e=r(2);h(e.cx("clearIcon")),a("pBind",e.ptm("clearIcon")),k("aria-hidden",!0),p(),a("ngTemplateOutlet",e.clearIconTemplate||e._clearIconTemplate)}}function xo(t,l){if(t&1&&(B(0),d(1,_o,1,4,"svg",19)(2,bo,2,5,"span",20),F()),t&2){let e=r();p(),a("ngIf",!e.clearIconTemplate&&!e._clearIconTemplate),p(),a("ngIf",e.clearIconTemplate||e._clearIconTemplate)}}function wo(t,l){t&1&&N(0)}function Co(t,l){if(t&1){let e=D();y(0,"span",22),V("click",function(n){u(e);let o=r(2).index,s=r(2);return m(!s.readonly&&!s.$disabled()?s.removeOption(n,o):"")}),ne(),se(1,"svg",31),v()}if(t&2){let e=r(4);h(e.cx("chipIcon")),a("pBind",e.ptm("chipIcon")),p(),h(e.cx("chipIcon")),k("aria-hidden",!0)}}function Io(t,l){}function To(t,l){t&1&&d(0,Io,0,0,"ng-template")}function So(t,l){if(t&1&&(y(0,"span",32),d(1,To,1,0,null,29),v()),t&2){let e=r(2).index,i=r(2);a("pBind",i.ptm("chipIcon")),k("aria-hidden",!0),p(),a("ngTemplateOutlet",i.removeIconTemplate||i._removeIconTemplate)("ngTemplateOutletContext",Ne(4,co,i.removeOption.bind(i),e,i.cx("chipIcon")))}}function Oo(t,l){if(t&1&&d(0,Co,2,6,"span",20)(1,So,2,8,"span",30),t&2){let e=r(3);a("ngIf",!e.removeIconTemplate&&!e._removeIconTemplate),p(),a("ngIf",e.removeIconTemplate||e._removeIconTemplate)}}function Eo(t,l){if(t&1){let e=D();y(0,"li",26,5)(2,"p-chip",28),V("onRemove",function(n){let o=u(e).index,s=r(2);return m(s.readonly?"":s.removeOption(n,o))}),d(3,wo,1,0,"ng-container",29)(4,Oo,2,2,"ng-template",null,6,G),v()()}if(t&2){let e=l.$implicit,i=l.index,n=r(2);h(n.cx("chipItem",P(16,po,i))),a("pBind",n.ptm("chipItem")),k("id",n.id+"_multiple_option_"+i)("aria-label",n.getOptionLabel(e))("aria-setsize",n.modelValue().length)("aria-posinset",i+1)("aria-selected",!0),p(2),h(n.cx("pcChip")),a("pt",n.ptm("pcChip"))("label",!n.selectedItemTemplate&&!n._selectedItemTemplate&&n.getOptionLabel(e))("disabled",n.$disabled())("removable",!0),p(),a("ngTemplateOutlet",n.selectedItemTemplate||n._selectedItemTemplate)("ngTemplateOutletContext",P(18,Oi,e))}}function ko(t,l){if(t&1){let e=D();y(0,"ul",24,3),V("focus",function(n){u(e);let o=r();return m(o.onMultipleContainerFocus(n))})("blur",function(n){u(e);let o=r();return m(o.onMultipleContainerBlur(n))})("keydown",function(n){u(e);let o=r();return m(o.onMultipleContainerKeyDown(n))}),d(2,Eo,6,20,"li",25),y(3,"li",26)(4,"input",27,4),V("input",function(n){u(e);let o=r();return m(o.onInput(n))})("keydown",function(n){u(e);let o=r();return m(o.onKeyDown(n))})("change",function(n){u(e);let o=r();return m(o.onInputChange(n))})("focus",function(n){u(e);let o=r();return m(o.onInputFocus(n))})("blur",function(n){u(e);let o=r();return m(o.onInputBlur(n))})("paste",function(n){u(e);let o=r();return m(o.onInputPaste(n))})("keyup",function(n){u(e);let o=r();return m(o.onInputKeyUp(n))}),v()()()}if(t&2){let e=r();h(e.cx("inputMultiple")),a("pBind",e.ptm("inputMultiple"))("tabindex",-1),k("aria-orientation","horizontal")("aria-activedescendant",e.focused?e.focusedMultipleOptionId:void 0),p(2),a("ngForOf",e.modelValue()),p(),h(e.cx("inputChip")),a("pBind",e.ptm("inputChip")),p(),h(e.cx("pcInputText")),a("pAutoFocus",e.autofocus)("pBind",e.ptm("input"))("ngStyle",e.inputStyle),k("type",e.type)("id",e.inputId)("autocomplete",e.autocomplete)("name",e.name())("minlength",e.minlength())("maxlength",e.maxlength())("size",e.size())("min",e.min())("max",e.max())("pattern",e.pattern())("placeholder",e.$filled()?null:e.placeholder)("tabindex",e.$disabled()?-1:e.tabindex)("required",e.required()?"":void 0)("readonly",e.readonly?"":void 0)("disabled",e.$disabled()?"":void 0)("aria-label",e.ariaLabel)("aria-labelledby",e.ariaLabelledBy)("aria-required",e.required())("aria-expanded",e.overlayVisible??!1)("aria-controls",e.overlayVisible?e.id+"_list":null)("aria-activedescendant",e.focused?e.focusedOptionId:void 0)}}function Vo(t,l){if(t&1&&(ne(),se(0,"svg",35)),t&2){let e=r(2);h(e.cx("loader")),a("pBind",e.ptm("loader"))("spin",!0),k("aria-hidden",!0)}}function Mo(t,l){}function Lo(t,l){t&1&&d(0,Mo,0,0,"ng-template")}function Ao(t,l){if(t&1&&(y(0,"span",32),d(1,Lo,1,0,null,23),v()),t&2){let e=r(2);h(e.cx("loader")),a("pBind",e.ptm("loader")),k("aria-hidden",!0),p(),a("ngTemplateOutlet",e.loadingIconTemplate||e._loadingIconTemplate)}}function Do(t,l){if(t&1&&(B(0),d(1,Vo,1,5,"svg",33)(2,Ao,2,5,"span",34),F()),t&2){let e=r();p(),a("ngIf",!e.loadingIconTemplate&&!e._loadingIconTemplate),p(),a("ngIf",e.loadingIconTemplate||e._loadingIconTemplate)}}function zo(t,l){if(t&1&&se(0,"span",38),t&2){let e=r(2);a("ngClass",e.dropdownIcon),k("aria-hidden",!0)}}function Bo(t,l){if(t&1&&(ne(),se(0,"svg",40)),t&2){let e=r(3);a("pBind",e.ptm("dropdown"))}}function Fo(t,l){}function Ro(t,l){t&1&&d(0,Fo,0,0,"ng-template")}function No(t,l){if(t&1&&(B(0),d(1,Bo,1,1,"svg",39)(2,Ro,1,0,null,23),F()),t&2){let e=r(2);p(),a("ngIf",!e.dropdownIconTemplate&&!e._dropdownIconTemplate),p(),a("ngTemplateOutlet",e.dropdownIconTemplate||e._dropdownIconTemplate)}}function Po(t,l){if(t&1){let e=D();y(0,"button",36,7),V("click",function(n){u(e);let o=r();return m(o.handleDropdownClick(n))}),d(2,zo,1,2,"span",37)(3,No,3,2,"ng-container",14),v()}if(t&2){let e=r();h(e.cx("dropdown")),a("pBind",e.ptm("dropdown"))("disabled",e.$disabled()),k("aria-label",e.dropdownAriaLabel)("tabindex",e.tabindex),p(2),a("ngIf",e.dropdownIcon),p(),a("ngIf",!e.dropdownIcon)}}function jo(t,l){t&1&&N(0)}function Ho(t,l){t&1&&N(0)}function $o(t,l){if(t&1&&d(0,Ho,1,0,"ng-container",29),t&2){let e=l.$implicit,i=l.options;r(2);let n=le(6);a("ngTemplateOutlet",n)("ngTemplateOutletContext",me(2,Ei,e,i))}}function Qo(t,l){t&1&&N(0)}function Ko(t,l){if(t&1&&d(0,Qo,1,0,"ng-container",29),t&2){let e=l.options,i=r(4);a("ngTemplateOutlet",i.loaderTemplate||i._loaderTemplate)("ngTemplateOutletContext",P(2,uo,e))}}function qo(t,l){t&1&&(B(0),d(1,Ko,1,4,"ng-template",null,10,G),F())}function Wo(t,l){if(t&1){let e=D();y(0,"p-scroller",45,9),V("onLazyLoad",function(n){u(e);let o=r(2);return m(o.onLazyLoad.emit(n))}),d(2,$o,1,5,"ng-template",null,1,G)(4,qo,3,0,"ng-container",14),v()}if(t&2){let e=r(2);ge(P(9,ot,e.scrollHeight)),a("pt",e.ptm("virtualScroller"))("items",e.visibleOptions())("itemSize",e.virtualScrollItemSize)("autoSize",!0)("lazy",e.lazy)("options",e.virtualScrollOptions),p(4),a("ngIf",e.loaderTemplate||e._loaderTemplate)}}function Go(t,l){t&1&&N(0)}function Uo(t,l){if(t&1&&(B(0),d(1,Go,1,0,"ng-container",29),F()),t&2){r();let e=le(6),i=r();p(),a("ngTemplateOutlet",e)("ngTemplateOutletContext",me(3,Ei,i.visibleOptions(),We(2,mo)))}}function Zo(t,l){if(t&1&&(y(0,"span"),Ie(1),v()),t&2){let e=r(2).$implicit,i=r(3);p(),Re(i.getOptionGroupLabel(e.optionGroup))}}function Xo(t,l){t&1&&N(0)}function Yo(t,l){if(t&1&&(B(0),y(1,"li",49),d(2,Zo,2,1,"span",14)(3,Xo,1,0,"ng-container",29),v(),F()),t&2){let e=r(),i=e.$implicit,n=e.index,o=r().options,s=r(2);p(),h(s.cx("optionGroup")),a("pBind",s.ptm("optionGroup"))("ngStyle",P(8,ot,o.itemSize+"px")),k("id",s.id+"_"+s.getOptionIndex(n,o)),p(),a("ngIf",!s.groupTemplate),p(),a("ngTemplateOutlet",s.groupTemplate)("ngTemplateOutletContext",P(10,Oi,i.optionGroup))}}function Jo(t,l){if(t&1&&(y(0,"span"),Ie(1),v()),t&2){let e=r(2).$implicit,i=r(3);p(),Re(i.getOptionLabel(e))}}function es(t,l){t&1&&N(0)}function ts(t,l){if(t&1){let e=D();B(0),y(1,"li",50),V("click",function(n){u(e);let o=r().$implicit,s=r(3);return m(s.onOptionSelect(n,o))})("mouseenter",function(n){u(e);let o=r().index,s=r().options,c=r(2);return m(c.onOptionMouseEnter(n,c.getOptionIndex(o,s)))}),d(2,Jo,2,1,"span",14)(3,es,1,0,"ng-container",29),v(),F()}if(t&2){let e=r(),i=e.$implicit,n=e.index,o=r().options,s=r(2);p(),h(s.cx("option",Ne(14,ho,i,n,o))),a("pBind",s.getPTOptions(i,o,n,"option"))("ngStyle",P(18,ot,o.itemSize+"px")),k("id",s.id+"_"+s.getOptionIndex(n,o))("aria-label",s.getOptionLabel(i))("aria-selected",s.isSelected(i))("aria-disabled",s.isOptionDisabled(i))("data-p-focused",s.focusedOptionIndex()===s.getOptionIndex(n,o))("aria-setsize",s.ariaSetSize)("aria-posinset",s.getAriaPosInset(s.getOptionIndex(n,o))),p(),a("ngIf",!s.itemTemplate&&!s._itemTemplate),p(),a("ngTemplateOutlet",s.itemTemplate||s._itemTemplate)("ngTemplateOutletContext",me(20,fo,i,o.getOptions?o.getOptions(n):n))}}function is(t,l){if(t&1&&d(0,Yo,4,12,"ng-container",14)(1,ts,4,23,"ng-container",14),t&2){let e=l.$implicit,i=r(3);a("ngIf",i.isOptionGroup(e)),p(),a("ngIf",!i.isOptionGroup(e))}}function ns(t,l){if(t&1&&(B(0),Ie(1),F()),t&2){let e=r(4);p(),rt(" ",e.searchResultMessageText," ")}}function os(t,l){t&1&&N(0,null,12)}function ss(t,l){if(t&1&&(y(0,"li",49),d(1,ns,2,1,"ng-container",51)(2,os,2,0,"ng-container",23),v()),t&2){let e=r().options,i=r(2);h(i.cx("emptyMessage")),a("pBind",i.ptm("emptyMessage"))("ngStyle",P(7,ot,e.itemSize+"px")),p(),a("ngIf",!i.emptyTemplate&&!i._emptyTemplate)("ngIfElse",i.empty),p(),a("ngTemplateOutlet",i.emptyTemplate||i._emptyTemplate)}}function ls(t,l){if(t&1&&(y(0,"ul",46,11),d(2,is,2,2,"ng-template",47)(3,ss,3,9,"li",48),v()),t&2){let e=l.$implicit,i=l.options,n=r(2);ge(i.contentStyle),h(n.cn(n.cx("list"),i.contentStyleClass)),a("pBind",n.ptm("list")),k("id",n.id+"_list")("aria-label",n.listLabel),p(2),a("ngForOf",e),p(),a("ngIf",!e||e&&e.length===0&&n.showEmptyMessage)}}function rs(t,l){t&1&&N(0)}function as(t,l){if(t&1&&(y(0,"div",41),d(1,jo,1,0,"ng-container",23),y(2,"div",42),d(3,Wo,5,11,"p-scroller",43)(4,Uo,2,6,"ng-container",14),v(),d(5,ls,4,9,"ng-template",null,8,G)(7,rs,1,0,"ng-container",23),v(),y(8,"span",44),Ie(9),v()),t&2){let e=r();h(e.cn(e.cx("overlay"),e.panelStyleClass)),a("pBind",e.ptm("overlay"))("ngStyle",e.panelStyle),p(),a("ngTemplateOutlet",e.headerTemplate||e._headerTemplate),p(),h(e.cx("listContainer")),De("max-height",e.virtualScroll?"auto":e.scrollHeight),a("pBind",e.ptm("listContainer"))("tabindex",-1),p(),a("ngIf",e.virtualScroll),p(),a("ngIf",!e.virtualScroll),p(3),a("ngTemplateOutlet",e.footerTemplate||e._footerTemplate),p(2),rt(" ",e.selectedMessageText," ")}}var ps=`
    ${Ii}

    /* For PrimeNG */
    p-autoComplete.ng-invalid.ng-dirty .p-autocomplete-input,
    p-autoComplete.ng-invalid.ng-dirty .p-autocomplete-input-multiple,
    p-auto-complete.ng-invalid.ng-dirty .p-autocomplete-input,
    p-auto-complete.ng-invalid.ng-dirty .p-autocomplete-input-multiple p-autocomplete.ng-invalid.ng-dirty .p-autocomplete-input,
    p-autocomplete.ng-invalid.ng-dirty .p-autocomplete-input-multiple {
        border-color: dt('autocomplete.invalid.border.color');
    }

    p-autoComplete.ng-invalid.ng-dirty .p-autocomplete-input:enabled:focus,
    p-autoComplete.ng-invalid.ng-dirty:not(.p-disabled).p-focus .p-autocomplete-input-multiple,
    p-auto-complete.ng-invalid.ng-dirty .p-autocomplete-input:enabled:focus,
    p-auto-complete.ng-invalid.ng-dirty:not(.p-disabled).p-focus .p-autocomplete-input-multiple,
    p-autocomplete.ng-invalid.ng-dirty .p-autocomplete-input:enabled:focus,
    p-autocomplete.ng-invalid.ng-dirty:not(.p-disabled).p-focus .p-autocomplete-input-multiple {
        border-color: dt('autocomplete.focus.border.color');
    }

    p-autoComplete.ng-invalid.ng-dirty .p-autocomplete-input-chip input::placeholder,
    p-auto-complete.ng-invalid.ng-dirty .p-autocomplete-input-chip input::placeholder,
    p-autocomplete.ng-invalid.ng-dirty .p-autocomplete-input-chip input::placeholder {
        color: dt('autocomplete.invalid.placeholder.color');
    }

    p-autoComplete.ng-invalid.ng-dirty .p-autocomplete-input::placeholder,
    p-auto-complete.ng-invalid.ng-dirty .p-autocomplete-input::placeholder,
    p-autocomplete.ng-invalid.ng-dirty .p-autocomplete-input::placeholder {
        color: dt('autocomplete.invalid.placeholder.color');
    }
`,cs={root:{position:"relative"}},ds={root:({instance:t})=>["p-autocomplete p-component p-inputwrapper",{"p-invalid":t.invalid(),"p-focus":t.focused,"p-inputwrapper-filled":t.$filled(),"p-inputwrapper-focus":t.focused&&!t.$disabled()||t.autofocus||t.overlayVisible,"p-autocomplete-open":t.overlayVisible,"p-autocomplete-clearable":t.showClear&&!t.$disabled(),"p-autocomplete-fluid":t.hasFluid}],pcInputText:"p-autocomplete-input",inputMultiple:({instance:t})=>["p-autocomplete-input-multiple",{"p-disabled":t.$disabled(),"p-variant-filled":t.$variant()==="filled"}],chipItem:({instance:t,i:l})=>["p-autocomplete-chip-item",{"p-focus":t.focusedMultipleOptionIndex()===l}],pcChip:"p-autocomplete-chip",chipIcon:"p-autocomplete-chip-icon",inputChip:"p-autocomplete-input-chip",loader:"p-autocomplete-loader",dropdown:"p-autocomplete-dropdown",overlay:({instance:t})=>["p-autocomplete-overlay p-component-overlay p-component",{"p-input-filled":t.$variant()==="filled","p-ripple-disabled":t.config.ripple()===!1}],listContainer:"p-autocomplete-list-container",list:"p-autocomplete-list",optionGroup:"p-autocomplete-option-group",option:({instance:t,option:l,i:e,scrollerOptions:i})=>({"p-autocomplete-option":!0,"p-autocomplete-option-selected":t.isSelected(l),"p-focus":t.focusedOptionIndex()===t.getOptionIndex(e,i),"p-disabled":t.isOptionDisabled(l)}),emptyMessage:"p-autocomplete-empty-message",clearIcon:"p-autocomplete-clear-icon"},Ti=(()=>{class t extends ee{name="autocomplete";style=ps;classes=ds;inlineStyles=cs;static \u0275fac=(()=>{let e;return function(n){return(e||(e=R(t)))(n||t)}})();static \u0275prov=T({token:t,factory:t.\u0275fac})}return t})();var Si=new U("AUTOCOMPLETE_INSTANCE"),us={provide:Jt,useExisting:At(()=>ki),multi:!0},ki=(()=>{class t extends ci{overlayService;zone;$pcAutoComplete=_(Si,{optional:!0,skipSelf:!0})??void 0;bindDirectiveInstance=_(O,{self:!0});minLength=1;minQueryLength;delay=300;panelStyle;styleClass;panelStyleClass;inputStyle;inputId;inputStyleClass;placeholder;readonly;scrollHeight="200px";lazy=!1;virtualScroll;virtualScrollItemSize;virtualScrollOptions;autoHighlight;forceSelection;type="text";autoZIndex=!0;baseZIndex=0;ariaLabel;dropdownAriaLabel;ariaLabelledBy;dropdownIcon;unique=!0;group;completeOnFocus=!1;showClear=!1;dropdown;showEmptyMessage=!0;dropdownMode="blank";multiple;addOnTab=!1;tabindex;dataKey;emptyMessage;showTransitionOptions=".12s cubic-bezier(0, 0, 0.2, 1)";hideTransitionOptions=".1s linear";autofocus;autocomplete="off";optionGroupChildren="items";optionGroupLabel="label";overlayOptions;get suggestions(){return this._suggestions()}set suggestions(e){this._suggestions.set(e),this.handleSuggestionsChange()}optionLabel;optionValue;id;searchMessage;emptySelectionMessage;selectionMessage;autoOptionFocus=!1;selectOnFocus;searchLocale;optionDisabled;focusOnHover=!0;typeahead=!0;addOnBlur=!1;separator;appendTo=z(void 0);completeMethod=new S;onSelect=new S;onUnselect=new S;onAdd=new S;onFocus=new S;onBlur=new S;onDropdownClick=new S;onClear=new S;onInputKeydown=new S;onKeyUp=new S;onShow=new S;onHide=new S;onLazyLoad=new S;inputEL;multiInputEl;multiContainerEL;dropdownButton;itemsViewChild;scroller;overlayViewChild;itemsWrapper;itemTemplate;emptyTemplate;headerTemplate;footerTemplate;selectedItemTemplate;groupTemplate;loaderTemplate;removeIconTemplate;loadingIconTemplate;clearIconTemplate;dropdownIconTemplate;onHostClick(e){this.onContainerClick(e)}value;_suggestions=Ke(null);timeout;overlayVisible;suggestionsUpdated;highlightOption;highlightOptionChanged;focused=!1;loading;scrollHandler;listId;searchTimeout;dirty=!1;_itemTemplate;_groupTemplate;_selectedItemTemplate;_headerTemplate;_emptyTemplate;_footerTemplate;_loaderTemplate;_removeIconTemplate;_loadingIconTemplate;_clearIconTemplate;_dropdownIconTemplate;focusedMultipleOptionIndex=Ke(-1);focusedOptionIndex=Ke(-1);_componentStyle=_(Ti);$appendTo=re(()=>this.appendTo()||this.config.overlayAppendTo());visibleOptions=re(()=>this.group?this.flatOptions(this._suggestions()):this._suggestions()||[]);inputValue=re(()=>{let e=this.modelValue(),i=this.optionValueSelected?(this.suggestions||[]).find(n=>Fe(n,e,this.equalityKey())):e;if(Pe(e))if(typeof e=="object"||this.optionValueSelected){let n=this.getOptionLabel(i);return n??e}else return e;else return""});get focusedMultipleOptionId(){return this.focusedMultipleOptionIndex()!==-1?`${this.id}_multiple_option_${this.focusedMultipleOptionIndex()}`:null}get focusedOptionId(){return this.focusedOptionIndex()!==-1?`${this.id}_${this.focusedOptionIndex()}`:null}get searchResultMessageText(){return Pe(this.visibleOptions())&&this.overlayVisible?this.searchMessageText.replaceAll("{0}",this.visibleOptions().length):this.emptySearchMessageText}get searchMessageText(){return this.searchMessage||this.config.translation.searchMessage||""}get emptySearchMessageText(){return this.emptyMessage||this.config.translation.emptySearchMessage||""}get selectionMessageText(){return this.selectionMessage||this.config.translation.selectionMessage||""}get emptySelectionMessageText(){return this.emptySelectionMessage||this.config.translation.emptySelectionMessage||""}get selectedMessageText(){return this.hasSelectedOption()?this.selectionMessageText.replaceAll("{0}",this.multiple?this.modelValue()?.length:"1"):this.emptySelectionMessageText}get ariaSetSize(){return this.visibleOptions().filter(e=>!this.isOptionGroup(e)).length}get listLabel(){return this.config.getTranslation(Ye.ARIA).listLabel}get virtualScrollerDisabled(){return!this.virtualScroll}get optionValueSelected(){return typeof this.modelValue()=="string"&&this.optionValue}chipItemClass(e){return this._componentStyle.classes.chipItem({instance:this,i:e})}constructor(e,i){super(),this.overlayService=e,this.zone=i}onInit(){this.id=this.id||qt("pn_id_"),this.cd.detectChanges()}templates;onAfterContentInit(){this.templates.forEach(e=>{switch(e.getType()){case"item":this._itemTemplate=e.template;break;case"group":this._groupTemplate=e.template;break;case"selecteditem":this._selectedItemTemplate=e.template;break;case"selectedItem":this._selectedItemTemplate=e.template;break;case"header":this._headerTemplate=e.template;break;case"empty":this._emptyTemplate=e.template;break;case"footer":this._footerTemplate=e.template;break;case"loader":this._loaderTemplate=e.template;break;case"removetokenicon":this._removeIconTemplate=e.template;break;case"loadingicon":this._loadingIconTemplate=e.template;break;case"clearicon":this._clearIconTemplate=e.template;break;case"dropdownicon":this._dropdownIconTemplate=e.template;break;default:this._itemTemplate=e.template;break}})}onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"])),this.suggestionsUpdated&&this.overlayViewChild&&this.zone.runOutsideAngular(()=>{setTimeout(()=>{this.overlayViewChild&&this.overlayViewChild.alignOverlay()},1),this.suggestionsUpdated=!1})}handleSuggestionsChange(){if(this.loading){this._suggestions()?.length>0||this.showEmptyMessage||this.emptyTemplate?this.show():this.hide();let e=this.overlayVisible&&this.autoOptionFocus?this.findFirstFocusedOptionIndex():-1;this.focusedOptionIndex.set(e),this.suggestionsUpdated=!0,this.loading=!1,this.cd.markForCheck()}}flatOptions(e){return(e||[]).reduce((i,n,o)=>{i.push({optionGroup:n,group:!0,index:o});let s=this.getOptionGroupChildren(n);return s&&s.forEach(c=>i.push(c)),i},[])}isOptionGroup(e){return this.optionGroupLabel&&e.optionGroup&&e.group}findFirstOptionIndex(){return this.visibleOptions().findIndex(e=>this.isValidOption(e))}findLastOptionIndex(){return gt(this.visibleOptions(),e=>this.isValidOption(e))}findFirstFocusedOptionIndex(){let e=this.findSelectedOptionIndex();return e<0?this.findFirstOptionIndex():e}findLastFocusedOptionIndex(){let e=this.findSelectedOptionIndex();return e<0?this.findLastOptionIndex():e}findSelectedOptionIndex(){return this.hasSelectedOption()?this.visibleOptions().findIndex(e=>this.isValidSelectedOption(e)):-1}findNextOptionIndex(e){let i=e<this.visibleOptions().length-1?this.visibleOptions().slice(e+1).findIndex(n=>this.isValidOption(n)):-1;return i>-1?i+e+1:e}findPrevOptionIndex(e){let i=e>0?gt(this.visibleOptions().slice(0,e),n=>this.isValidOption(n)):-1;return i>-1?i:e}isValidSelectedOption(e){return this.isValidOption(e)&&this.isSelected(e)}isValidOption(e){return e&&!(this.isOptionDisabled(e)||this.isOptionGroup(e))}isOptionDisabled(e){return this.optionDisabled?Be(e,this.optionDisabled):!1}isSelected(e){return this.multiple?this.unique?this.modelValue()?.some(i=>Fe(i,e,this.equalityKey())):!1:Fe(this.modelValue(),e,this.equalityKey())}isOptionMatched(e,i){return this.isValidOption(e)&&this.getOptionLabel(e).toLocaleLowerCase(this.searchLocale)===i.toLocaleLowerCase(this.searchLocale)}isInputClicked(e){return e.target===this.inputEL?.nativeElement}isDropdownClicked(e){return this.dropdownButton?.nativeElement?e.target===this.dropdownButton.nativeElement||this.dropdownButton.nativeElement.contains(e.target):!1}equalityKey(){return this.optionValue?void 0:this.dataKey}onContainerClick(e){this.$disabled()||this.loading||this.isInputClicked(e)||this.isDropdownClicked(e)||(!this.overlayViewChild||!this.overlayViewChild.overlayViewChild?.nativeElement.contains(e.target))&&J(this.inputEL?.nativeElement)}handleDropdownClick(e){let i;this.overlayVisible?this.hide(!0):(J(this.inputEL?.nativeElement),i=this.inputEL?.nativeElement?.value,this.dropdownMode==="blank"?this.search(e,"","dropdown"):this.dropdownMode==="current"&&this.search(e,i,"dropdown")),this.onDropdownClick.emit({originalEvent:e,query:i})}onInput(e){if(this.typeahead){let i=this.minQueryLength||this.minLength;this.searchTimeout&&clearTimeout(this.searchTimeout);let n=e.target.value;this.maxlength()!==null&&(n=n.split("").slice(0,this.maxlength()).join("")),!this.multiple&&!this.forceSelection&&this.updateModel(n),n.length===0&&!this.multiple?(this.onClear.emit(),setTimeout(()=>{this.hide()},this.delay/2)):n.length>=i?(this.focusedOptionIndex.set(-1),this.searchTimeout=setTimeout(()=>{this.search(e,n,"input")},this.delay)):this.hide()}}onInputChange(e){if(this.forceSelection){let i=!1;if(this.visibleOptions()){let n=this.visibleOptions().find(o=>this.isOptionMatched(o,this.inputEL?.nativeElement?.value||""));n!==void 0&&(i=!0,!this.isSelected(n)&&this.onOptionSelect(e,n))}i||(this.inputEL?.nativeElement&&(this.inputEL.nativeElement.value=""),!this.multiple&&this.updateModel(null))}}onInputFocus(e){if(this.$disabled())return;!this.dirty&&this.completeOnFocus&&this.search(e,e.target.value,"focus"),this.dirty=!0,this.focused=!0;let i=this.focusedOptionIndex()!==-1?this.focusedOptionIndex():this.overlayVisible&&this.autoOptionFocus?this.findFirstFocusedOptionIndex():-1;this.focusedOptionIndex.set(i),this.overlayVisible&&this.scrollInView(this.focusedOptionIndex()),this.onFocus.emit(e)}onMultipleContainerFocus(e){this.$disabled()||(this.focused=!0)}onMultipleContainerBlur(e){this.focusedMultipleOptionIndex.set(-1),this.focused=!1}onMultipleContainerKeyDown(e){if(this.$disabled()){e.preventDefault();return}switch(e.code){case"ArrowLeft":this.onArrowLeftKeyOnMultiple(e);break;case"ArrowRight":this.onArrowRightKeyOnMultiple(e);break;case"Backspace":this.onBackspaceKeyOnMultiple(e);break;default:break}}onInputBlur(e){if(this.dirty=!1,this.focused=!1,this.focusedOptionIndex.set(-1),this.addOnBlur&&this.multiple&&!this.typeahead){let i=(this.multiInputEl?.nativeElement?.value||e.target.value||"").trim();i&&!this.isSelected(i)&&(this.updateModel([...this.modelValue()||[],i]),this.onAdd.emit({originalEvent:e,value:i}),this.multiInputEl?.nativeElement?this.multiInputEl.nativeElement.value="":e.target.value="")}this.onModelTouched(),this.onBlur.emit(e)}onInputPaste(e){if(this.separator&&this.multiple&&!this.typeahead){let i=(e.clipboardData||window.clipboardData)?.getData("Text");if(i){let n=i.split(this.separator),o=[...this.modelValue()||[]];if(n.forEach(s=>{let c=s.trim();c&&!this.isSelected(c)&&o.push(c)}),o.length>(this.modelValue()||[]).length){let s=o.slice((this.modelValue()||[]).length);this.updateModel(o),s.forEach(c=>{this.onAdd.emit({originalEvent:e,value:c})}),this.multiInputEl?.nativeElement?this.multiInputEl.nativeElement.value="":e.target.value="",e.preventDefault()}}}else this.onKeyDown(e)}onInputKeyUp(e){this.onKeyUp.emit(e)}onKeyDown(e){if(this.$disabled()){e.preventDefault();return}switch(this.onInputKeydown.emit(e),e.code){case"ArrowDown":this.onArrowDownKey(e);break;case"ArrowUp":this.onArrowUpKey(e);break;case"ArrowLeft":this.onArrowLeftKey(e);break;case"ArrowRight":this.onArrowRightKey(e);break;case"Home":this.onHomeKey(e);break;case"End":this.onEndKey(e);break;case"PageDown":this.onPageDownKey(e);break;case"PageUp":this.onPageUpKey(e);break;case"Enter":case"NumpadEnter":this.onEnterKey(e);break;case"Escape":this.onEscapeKey(e);break;case"Tab":this.onTabKey(e);break;case"Backspace":this.onBackspaceKey(e);break;case"ShiftLeft":case"ShiftRight":break;default:this.handleSeparatorKey(e);break}}handleSeparatorKey(e){if(this.separator&&this.multiple&&!this.typeahead&&(this.separator===e.key||typeof this.separator=="string"&&e.key===this.separator||this.separator instanceof RegExp&&e.key.match(this.separator))){let i=(this.multiInputEl?.nativeElement?.value||e.target.value||"").trim();i&&!this.isSelected(i)&&(this.updateModel([...this.modelValue()||[],i]),this.onAdd.emit({originalEvent:e,value:i}),this.multiInputEl?.nativeElement?this.multiInputEl.nativeElement.value="":e.target.value="",e.preventDefault())}}onArrowDownKey(e){if(!this.overlayVisible)return;let i=this.focusedOptionIndex()!==-1?this.findNextOptionIndex(this.focusedOptionIndex()):this.findFirstFocusedOptionIndex();this.changeFocusedOptionIndex(e,i),e.preventDefault(),e.stopPropagation()}onArrowUpKey(e){if(this.overlayVisible)if(e.altKey)this.focusedOptionIndex()!==-1&&this.onOptionSelect(e,this.visibleOptions()[this.focusedOptionIndex()]),this.overlayVisible&&this.hide(),e.preventDefault();else{let i=this.focusedOptionIndex()!==-1?this.findPrevOptionIndex(this.focusedOptionIndex()):this.findLastFocusedOptionIndex();this.changeFocusedOptionIndex(e,i),e.preventDefault(),e.stopPropagation()}}onArrowLeftKey(e){let i=e.currentTarget;this.focusedOptionIndex.set(-1),this.multiple&&(ft(i.value)&&this.hasSelectedOption()?(J(this.multiContainerEL?.nativeElement),this.focusedMultipleOptionIndex.set(this.modelValue().length)):e.stopPropagation())}onArrowRightKey(e){this.focusedOptionIndex.set(-1),this.multiple&&e.stopPropagation()}onHomeKey(e){let{currentTarget:i}=e,n=i.value.length;i.setSelectionRange(0,e.shiftKey?n:0),this.focusedOptionIndex.set(-1),e.preventDefault()}onEndKey(e){let{currentTarget:i}=e,n=i.value.length;i.setSelectionRange(e.shiftKey?0:n,n),this.focusedOptionIndex.set(-1),e.preventDefault()}onPageDownKey(e){this.scrollInView(this.visibleOptions().length-1),e.preventDefault()}onPageUpKey(e){this.scrollInView(0),e.preventDefault()}onEnterKey(e){if(!this.typeahead&&!this.forceSelection&&this.multiple){let i=e.target.value?.trim();i&&!this.isSelected(i)&&(this.updateModel([...this.modelValue()||[],i]),this.inputEL?.nativeElement&&(this.inputEL.nativeElement.value=""))}if(this.overlayVisible)this.focusedOptionIndex()!==-1&&this.onOptionSelect(e,this.visibleOptions()[this.focusedOptionIndex()]),this.hide();else return;e.preventDefault()}onEscapeKey(e){this.overlayVisible&&this.hide(!0),e.preventDefault()}onTabKey(e){if(this.focusedOptionIndex()!==-1){this.onOptionSelect(e,this.visibleOptions()[this.focusedOptionIndex()]);return}if(this.multiple&&!this.typeahead){let i=(this.multiInputEl?.nativeElement?.value||this.inputEL?.nativeElement?.value||"").trim();if(this.addOnTab&&i&&!this.isSelected(i)){this.updateModel([...this.modelValue()||[],i]),this.onAdd.emit({originalEvent:e,value:i}),this.multiInputEl?.nativeElement?this.multiInputEl.nativeElement.value="":this.inputEL?.nativeElement&&(this.inputEL.nativeElement.value=""),this.updateInputValue(),e.preventDefault(),this.overlayVisible&&this.hide();return}}this.overlayVisible&&this.hide()}onBackspaceKey(e){if(this.multiple){if(Pe(this.modelValue())&&!this.inputEL?.nativeElement?.value){let i=this.modelValue()[this.modelValue().length-1],n=this.modelValue().slice(0,-1);this.updateModel(n),this.onUnselect.emit({originalEvent:e,value:i})}e.stopPropagation()}}onArrowLeftKeyOnMultiple(e){let i=this.focusedMultipleOptionIndex()<1?0:this.focusedMultipleOptionIndex()-1;this.focusedMultipleOptionIndex.set(i)}onArrowRightKeyOnMultiple(e){let i=this.focusedMultipleOptionIndex();i++,this.focusedMultipleOptionIndex.set(i),i>this.modelValue().length-1&&(this.focusedMultipleOptionIndex.set(-1),J(this.inputEL?.nativeElement))}onBackspaceKeyOnMultiple(e){this.focusedMultipleOptionIndex()!==-1&&this.removeOption(e,this.focusedMultipleOptionIndex())}onOptionSelect(e,i,n=!0){this.multiple?(this.inputEL?.nativeElement&&(this.inputEL.nativeElement.value=""),this.isSelected(i)||this.updateModel([...this.modelValue()||[],i])):this.updateModel(i),this.onSelect.emit({originalEvent:e,value:i}),n&&this.hide(!0)}onOptionMouseEnter(e,i){this.focusOnHover&&this.changeFocusedOptionIndex(e,i)}search(e,i,n){i!=null&&(n==="input"&&i.trim().length===0||(this.loading=!0,this.completeMethod.emit({originalEvent:e,query:i})))}removeOption(e,i){e.stopPropagation();let n=this.modelValue()[i],o=this.modelValue().filter((s,c)=>c!==i);this.updateModel(o),this.onUnselect.emit({originalEvent:e,value:n}),J(this.inputEL?.nativeElement)}updateModel(e){let i=null;e&&(i=this.multiple?e.map(n=>this.getOptionValue(n)):this.getOptionValue(e)),this.value=i,this.writeModelValue(e),this.onModelChange(i),this.updateInputValue(),this.cd.markForCheck()}updateInputValue(){this.inputEL&&this.inputEL.nativeElement&&(this.multiple?this.inputEL.nativeElement.value="":this.inputEL.nativeElement.value=this.inputValue())}autoUpdateModel(){if((this.selectOnFocus||this.autoHighlight)&&this.autoOptionFocus&&!this.hasSelectedOption()){let e=this.findFirstFocusedOptionIndex();this.focusedOptionIndex.set(e),this.onOptionSelect(null,this.visibleOptions()[this.focusedOptionIndex()],!1)}}scrollInView(e=-1){let i=e!==-1?`${this.id}_${e}`:this.focusedOptionId;if(this.itemsViewChild&&this.itemsViewChild.nativeElement){let n=ze(this.itemsViewChild.nativeElement,`li[id="${i}"]`);n?n.scrollIntoView&&n.scrollIntoView({block:"nearest",inline:"nearest"}):this.virtualScrollerDisabled||setTimeout(()=>{this.virtualScroll&&this.scroller?.scrollToIndex(e!==-1?e:this.focusedOptionIndex())},0)}}changeFocusedOptionIndex(e,i){this.focusedOptionIndex()!==i&&(this.focusedOptionIndex.set(i),this.scrollInView(),this.selectOnFocus&&this.onOptionSelect(e,this.visibleOptions()[i],!1))}show(e=!1){this.dirty=!0,this.overlayVisible=!0;let i=this.focusedOptionIndex()!==-1?this.focusedOptionIndex():this.autoOptionFocus?this.findFirstFocusedOptionIndex():-1;this.focusedOptionIndex.set(i),e&&J(this.inputEL?.nativeElement),e&&J(this.inputEL?.nativeElement),this.onShow.emit(),this.cd.markForCheck()}hide(e=!1){let i=()=>{this.dirty=e,this.overlayVisible=!1,this.focusedOptionIndex.set(-1),e&&J(this.inputEL?.nativeElement),this.onHide.emit(),this.cd.markForCheck()};setTimeout(()=>{i()},0)}clear(){this.updateModel(null),this.inputEL?.nativeElement&&(this.inputEL.nativeElement.value=""),this.onClear.emit()}hasSelectedOption(){return Pe(this.modelValue())}getAriaPosInset(e){return(this.optionGroupLabel?e-this.visibleOptions().slice(0,e).filter(i=>this.isOptionGroup(i)).length:e)+1}getOptionLabel(e){return this.optionLabel?Be(e,this.optionLabel):e&&e.label!=null?e.label:e}getOptionValue(e){return this.optionValue?Be(e,this.optionValue):e&&e.value!=null?e.value:e}getOptionIndex(e,i){return this.virtualScrollerDisabled?e:i&&i.getItemOptions(e).index}getOptionGroupLabel(e){return this.optionGroupLabel?Be(e,this.optionGroupLabel):e&&e.label!=null?e.label:e}getOptionGroupChildren(e){return this.optionGroupChildren?Be(e,this.optionGroupChildren):e.items}getPTOptions(e,i,n,o){return this.ptm(o,{context:{option:e,index:this.getOptionIndex(n,i),selected:this.isSelected(e),focused:this.focusedOptionIndex()===this.getOptionIndex(n,i),disabled:this.isOptionDisabled(e)}})}onOverlayAnimationStart(e){if(e.toState==="visible"&&(this.itemsWrapper=ze(this.overlayViewChild.overlayViewChild?.nativeElement,this.virtualScroll?".p-scroller":".p-autocomplete-panel"),this.virtualScroll&&(this.scroller?.setContentEl(this.itemsViewChild?.nativeElement),this.scroller?.viewInit()),this.visibleOptions()&&this.visibleOptions().length))if(this.virtualScroll){let i=this.modelValue()?this.focusedOptionIndex():-1;i!==-1&&this.scroller?.scrollToIndex(i)}else{let i=ze(this.itemsWrapper,".p-autocomplete-item.p-highlight");i&&i.scrollIntoView({block:"nearest",inline:"center"})}}writeControlValue(e,i){let n=this.multiple?this.visibleOptions().filter(o=>e?.some(s=>Fe(s,o,this.equalityKey()))):this.visibleOptions().find(o=>Fe(e,o,this.equalityKey()));this.value=e,i(ft(n)?e:n),this.updateInputValue(),this.cd.markForCheck()}onDestroy(){this.scrollHandler&&(this.scrollHandler.destroy(),this.scrollHandler=null)}static \u0275fac=function(i){return new(i||t)(fe(Xe),fe(he))};static \u0275cmp=Z({type:t,selectors:[["p-autoComplete"],["p-autocomplete"],["p-auto-complete"]],contentQueries:function(i,n,o){if(i&1&&(M(o,Kn,5),M(o,qn,5),M(o,Wn,5),M(o,Gn,5),M(o,Un,5),M(o,Zn,5),M(o,Xn,5),M(o,Yn,5),M(o,Jn,5),M(o,eo,5),M(o,to,5),M(o,ve,4)),i&2){let s;f(s=g())&&(n.itemTemplate=s.first),f(s=g())&&(n.emptyTemplate=s.first),f(s=g())&&(n.headerTemplate=s.first),f(s=g())&&(n.footerTemplate=s.first),f(s=g())&&(n.selectedItemTemplate=s.first),f(s=g())&&(n.groupTemplate=s.first),f(s=g())&&(n.loaderTemplate=s.first),f(s=g())&&(n.removeIconTemplate=s.first),f(s=g())&&(n.loadingIconTemplate=s.first),f(s=g())&&(n.clearIconTemplate=s.first),f(s=g())&&(n.dropdownIconTemplate=s.first),f(s=g())&&(n.templates=s)}},viewQuery:function(i,n){if(i&1&&(W(io,5),W(no,5),W(oo,5),W(so,5),W(lo,5),W(ro,5),W(ao,5)),i&2){let o;f(o=g())&&(n.inputEL=o.first),f(o=g())&&(n.multiInputEl=o.first),f(o=g())&&(n.multiContainerEL=o.first),f(o=g())&&(n.dropdownButton=o.first),f(o=g())&&(n.itemsViewChild=o.first),f(o=g())&&(n.scroller=o.first),f(o=g())&&(n.overlayViewChild=o.first)}},hostVars:4,hostBindings:function(i,n){i&1&&V("click",function(s){return n.onHostClick(s)}),i&2&&(ge(n.sx("root")),h(n.cn(n.cx("root"),n.styleClass)))},inputs:{minLength:[2,"minLength","minLength",Te],minQueryLength:[2,"minQueryLength","minQueryLength",Te],delay:[2,"delay","delay",Te],panelStyle:"panelStyle",styleClass:"styleClass",panelStyleClass:"panelStyleClass",inputStyle:"inputStyle",inputId:"inputId",inputStyleClass:"inputStyleClass",placeholder:"placeholder",readonly:[2,"readonly","readonly",I],scrollHeight:"scrollHeight",lazy:[2,"lazy","lazy",I],virtualScroll:[2,"virtualScroll","virtualScroll",I],virtualScrollItemSize:[2,"virtualScrollItemSize","virtualScrollItemSize",Te],virtualScrollOptions:"virtualScrollOptions",autoHighlight:[2,"autoHighlight","autoHighlight",I],forceSelection:[2,"forceSelection","forceSelection",I],type:"type",autoZIndex:[2,"autoZIndex","autoZIndex",I],baseZIndex:[2,"baseZIndex","baseZIndex",Te],ariaLabel:"ariaLabel",dropdownAriaLabel:"dropdownAriaLabel",ariaLabelledBy:"ariaLabelledBy",dropdownIcon:"dropdownIcon",unique:[2,"unique","unique",I],group:[2,"group","group",I],completeOnFocus:[2,"completeOnFocus","completeOnFocus",I],showClear:[2,"showClear","showClear",I],dropdown:[2,"dropdown","dropdown",I],showEmptyMessage:[2,"showEmptyMessage","showEmptyMessage",I],dropdownMode:"dropdownMode",multiple:[2,"multiple","multiple",I],addOnTab:[2,"addOnTab","addOnTab",I],tabindex:[2,"tabindex","tabindex",Te],dataKey:"dataKey",emptyMessage:"emptyMessage",showTransitionOptions:"showTransitionOptions",hideTransitionOptions:"hideTransitionOptions",autofocus:[2,"autofocus","autofocus",I],autocomplete:"autocomplete",optionGroupChildren:"optionGroupChildren",optionGroupLabel:"optionGroupLabel",overlayOptions:"overlayOptions",suggestions:"suggestions",optionLabel:"optionLabel",optionValue:"optionValue",id:"id",searchMessage:"searchMessage",emptySelectionMessage:"emptySelectionMessage",selectionMessage:"selectionMessage",autoOptionFocus:[2,"autoOptionFocus","autoOptionFocus",I],selectOnFocus:[2,"selectOnFocus","selectOnFocus",I],searchLocale:[2,"searchLocale","searchLocale",I],optionDisabled:"optionDisabled",focusOnHover:[2,"focusOnHover","focusOnHover",I],typeahead:[2,"typeahead","typeahead",I],addOnBlur:[2,"addOnBlur","addOnBlur",I],separator:"separator",appendTo:[1,"appendTo"]},outputs:{completeMethod:"completeMethod",onSelect:"onSelect",onUnselect:"onUnselect",onAdd:"onAdd",onFocus:"onFocus",onBlur:"onBlur",onDropdownClick:"onDropdownClick",onClear:"onClear",onInputKeydown:"onInputKeydown",onKeyUp:"onKeyUp",onShow:"onShow",onHide:"onHide",onLazyLoad:"onLazyLoad"},features:[Y([us,Ti,{provide:Si,useExisting:t},{provide:te,useExisting:t}]),X([O]),$],decls:9,vars:13,consts:[["overlay",""],["content",""],["focusInput",""],["multiContainer",""],["focusInput","","multiIn",""],["token",""],["removeicon",""],["ddBtn",""],["buildInItems",""],["scroller",""],["loader",""],["items",""],["empty",""],["pInputText","","aria-autocomplete","list","role","combobox",3,"pAutoFocus","pt","class","ngStyle","variant","invalid","pSize","fluid","input","keydown","change","focus","blur","paste","keyup",4,"ngIf"],[4,"ngIf"],["role","listbox",3,"pBind","class","tabindex","focus","blur","keydown",4,"ngIf"],["type","button","pRipple","",3,"pBind","class","disabled","click",4,"ngIf"],[3,"visibleChange","onAnimationStart","onHide","pt","hostAttrSelector","visible","options","target","appendTo","showTransitionOptions","hideTransitionOptions"],["pInputText","","aria-autocomplete","list","role","combobox",3,"input","keydown","change","focus","blur","paste","keyup","pAutoFocus","pt","ngStyle","variant","invalid","pSize","fluid"],["data-p-icon","times",3,"pBind","class","click",4,"ngIf"],[3,"pBind","class","click",4,"ngIf"],["data-p-icon","times",3,"click","pBind"],[3,"click","pBind"],[4,"ngTemplateOutlet"],["role","listbox",3,"focus","blur","keydown","pBind","tabindex"],["role","option",3,"pBind","class",4,"ngFor","ngForOf"],["role","option",3,"pBind"],["role","combobox","aria-autocomplete","list",3,"input","keydown","change","focus","blur","paste","keyup","pAutoFocus","pBind","ngStyle"],[3,"onRemove","pt","label","disabled","removable"],[4,"ngTemplateOutlet","ngTemplateOutletContext"],[3,"pBind",4,"ngIf"],["data-p-icon","times-circle"],[3,"pBind"],["data-p-icon","spinner",3,"pBind","class","spin",4,"ngIf"],[3,"pBind","class",4,"ngIf"],["data-p-icon","spinner",3,"pBind","spin"],["type","button","pRipple","",3,"click","pBind","disabled"],[3,"ngClass",4,"ngIf"],[3,"ngClass"],["data-p-icon","chevron-down",3,"pBind",4,"ngIf"],["data-p-icon","chevron-down",3,"pBind"],[3,"pBind","ngStyle"],[3,"pBind","tabindex"],[3,"pt","items","style","itemSize","autoSize","lazy","options","onLazyLoad",4,"ngIf"],["role","status","aria-live","polite",1,"p-hidden-accessible"],[3,"onLazyLoad","pt","items","itemSize","autoSize","lazy","options"],["role","listbox",3,"pBind"],["ngFor","",3,"ngForOf"],["role","option",3,"pBind","class","ngStyle",4,"ngIf"],["role","option",3,"pBind","ngStyle"],["pRipple","","role","option",3,"click","mouseenter","pBind","ngStyle"],[4,"ngIf","ngIfElse"]],template:function(i,n){if(i&1){let o=D();d(0,go,2,31,"input",13)(1,xo,3,2,"ng-container",14)(2,ko,7,36,"ul",15)(3,Do,3,2,"ng-container",14)(4,Po,4,8,"button",16),y(5,"p-overlay",17,0),Pt("visibleChange",function(c){return u(o),Nt(n.overlayVisible,c)||(n.overlayVisible=c),m(c)}),V("onAnimationStart",function(c){return u(o),m(n.onOverlayAnimationStart(c))})("onHide",function(){return u(o),m(n.hide())}),d(7,as,10,15,"ng-template",null,1,G),v()}i&2&&(a("ngIf",!n.multiple),p(),a("ngIf",n.$filled()&&!n.$disabled()&&n.showClear&&!n.loading),p(),a("ngIf",n.multiple),p(),a("ngIf",n.loading),p(),a("ngIf",n.dropdown),p(),a("pt",n.ptm("pcOverlay"))("hostAttrSelector",n.$attrSelector),Rt("visible",n.overlayVisible),a("options",n.overlayOptions)("target","@parent")("appendTo",n.$appendTo())("showTransitionOptions",n.showTransitionOptions)("hideTransitionOptions",n.hideTransitionOptions))},dependencies:[ae,Ge,Ue,_e,ye,Ze,yi,hi,Yt,Ci,Gt,it,tt,ni,yt,Q,Xt,Ut,O],encapsulation:2,changeDetection:0})}return t})(),Kr=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=ue({type:t});static \u0275inj=de({imports:[ki,Q,Q]})}return t})();var Vi={debounceTime:300,production:!1,ssoUri:"",apiUri:"",apiBaseUrl:"https://bogatov-group.ru/ymaps/api",apiUriMapbox:"",accessTokenMapBox:"",baseURL:""};var Mi=(()=>{let l=class l{constructor(){this.config={mapsApiKey:"042405c2-12f5-4b78-9580-cb5ea1d7c106",suggestApiKey:"23b76e0e-63d3-48f0-a3b5-e607d7c078e9",geocoderApiKey:"86b21bb6-3702-4519-bd25-93f8cfa92b78",apiBaseUrl:Vi.apiBaseUrl}}setConfig(i){this.config=A(A({},this.config),i)}get value(){return this.config}};l.\u0275fac=function(n){return new(n||l)},l.\u0275prov=T({token:l,factory:l.\u0275fac,providedIn:"root"});let t=l;return t})();var Jr=(()=>{let l=class l{constructor(i,n){this.http=i,this.yandexConfig=n}suggest(i,n,o="geo,biz",s=10){let c={apikey:this.yandexConfig.value.suggestApiKey,text:i,types:o,results:s};if(n){let[x,b]=n;c.bbox=`${x[0]},${x[1]}~${b[0]},${b[1]}`}return this.http.get("https://suggest-maps.yandex.ru/v1/suggest",{params:c}).pipe(Ce(x=>(x.results||[]).map(b=>{let w=b.title?.text||"",j=b.subtitle?.text||"";return{label:j?`${w}, ${j}`:w,rawLabel:w,subtitle:j,uri:b.uri}})))}geocode(i){if(!i?.trim())return Qe(null);let n={apikey:this.yandexConfig.value.geocoderApiKey,format:"json",geocode:i,results:1};return this.http.get("https://geocode-maps.yandex.ru/1.x/",{params:n}).pipe(Ce(o=>{let s=o?.response?.GeoObjectCollection?.featureMember?.[0]?.GeoObject;if(!s?.Point?.pos)return null;let[c,x]=s.Point.pos.split(" ").map(Number),b=s.metaDataProperty?.GeocoderMetaData?.text??i;return[c,x]}),st(()=>Qe(null)))}reverseGeocode(i){let n={apikey:this.yandexConfig.value.geocoderApiKey,format:"json",geocode:i.join(","),results:1};return this.http.get("https://geocode-maps.yandex.ru/1.x/",{params:n}).pipe(Lt(o=>{let c=o?.response?.GeoObjectCollection?.featureMember?.[0]?.GeoObject?.metaDataProperty?.GeocoderMetaData?.text??""}),Ce(()=>i),st(()=>Qe(null)))}};l.\u0275fac=function(n){return new(n||l)(lt(Ht),lt(Mi))},l.\u0275prov=T({token:l,factory:l.\u0275fac,providedIn:"root"});let t=l;return t})();var bt;try{bt=typeof Intl<"u"&&Intl.v8BreakIterator}catch{bt=!1}var Li=(()=>{class t{_platformId=_(Dt);isBrowser=this._platformId?Se(this._platformId):typeof document=="object"&&!!document;EDGE=this.isBrowser&&/(edge)/i.test(navigator.userAgent);TRIDENT=this.isBrowser&&/(msie|trident)/i.test(navigator.userAgent);BLINK=this.isBrowser&&!!(window.chrome||bt)&&typeof CSS<"u"&&!this.EDGE&&!this.TRIDENT;WEBKIT=this.isBrowser&&/AppleWebKit/i.test(navigator.userAgent)&&!this.BLINK&&!this.EDGE&&!this.TRIDENT;IOS=this.isBrowser&&/iPad|iPhone|iPod/.test(navigator.userAgent)&&!("MSStream"in window);FIREFOX=this.isBrowser&&/(firefox|minefield)/i.test(navigator.userAgent);ANDROID=this.isBrowser&&/android/i.test(navigator.userAgent)&&!this.TRIDENT;SAFARI=this.isBrowser&&/safari/i.test(navigator.userAgent)&&this.WEBKIT;constructor(){}static \u0275fac=function(i){return new(i||t)};static \u0275prov=T({token:t,factory:t.\u0275fac,providedIn:"root"})}return t})();function xt(t){return Array.isArray(t)?t:[t]}var Ai=new Set,Ve,zi=(()=>{class t{_platform=_(Li);_nonce=_(zt,{optional:!0});_matchMedia;constructor(){this._matchMedia=this._platform.isBrowser&&window.matchMedia?window.matchMedia.bind(window):fs}matchMedia(e){return(this._platform.WEBKIT||this._platform.BLINK)&&hs(e,this._nonce),this._matchMedia(e)}static \u0275fac=function(i){return new(i||t)};static \u0275prov=T({token:t,factory:t.\u0275fac,providedIn:"root"})}return t})();function hs(t,l){if(!Ai.has(t))try{Ve||(Ve=document.createElement("style"),l&&Ve.setAttribute("nonce",l),Ve.setAttribute("type","text/css"),document.head.appendChild(Ve)),Ve.sheet&&(Ve.sheet.insertRule(`@media ${t} {body{ }}`,0),Ai.add(t))}catch(e){console.error(e)}}function fs(t){return{matches:t==="all"||t==="",media:t,addListener:()=>{},removeListener:()=>{}}}var gs=(()=>{class t{_mediaMatcher=_(zi);_zone=_(he);_queries=new Map;_destroySubject=new It;constructor(){}ngOnDestroy(){this._destroySubject.next(),this._destroySubject.complete()}isMatched(e){return Di(xt(e)).some(n=>this._registerQuery(n).mql.matches)}observe(e){let n=Di(xt(e)).map(s=>this._registerQuery(s).observable),o=Tt(n);return o=St(o.pipe(Et(1)),o.pipe(kt(1),Ot(0))),o.pipe(Ce(s=>{let c={matches:!1,breakpoints:{}};return s.forEach(({matches:x,query:b})=>{c.matches=c.matches||x,c.breakpoints[b]=x}),c}))}_registerQuery(e){if(this._queries.has(e))return this._queries.get(e);let i=this._mediaMatcher.matchMedia(e),o={observable:new Ct(s=>{let c=x=>this._zone.run(()=>s.next(x));return i.addListener(c),()=>{i.removeListener(c)}}).pipe(Vt(i),Ce(({matches:s})=>({query:e,matches:s})),Mt(this._destroySubject)),mql:i};return this._queries.set(e,o),o}static \u0275fac=function(i){return new(i||t)};static \u0275prov=T({token:t,factory:t.\u0275fac,providedIn:"root"})}return t})();function Di(t){return t.map(l=>l.split(",")).reduce((l,e)=>l.concat(e)).map(l=>l.trim())}var wt={api:"",profile:"driving",alternatives:!0,congestion:!1,unit:"metric",flyTo:!0,placeholderOrigin:"Choose a starting place",placeholderDestination:"Choose destination",focusedStep:null,hoveredStep:null,zoom:16,language:"ru",compile:null,proximity:!1,styles:[],controls:{profileSwitcher:!0,instructions:!0},instructions:{showWaypointInstructions:!0},geocoder:{},interactive:!0,events:{},origin:{value:null,label:""},destination:{value:null,label:""},hoverMarker:{},waypoints:[],hoverWaypoints:[],originQuery:null,destinationQuery:null,originQueryCoordinates:null,destinationQueryCoordinates:null,directions:null,redraw:!1,fetchDirectionsRequest:null,routePadding:80,error:null};var ya=(()=>{let l=class l{constructor(){this.stateSubject=new ce(wt),this.state$=this.stateSubject.asObservable()}getState(){return this.stateSubject.getValue()}setFocusedStep(i){this.updateState({focusedStep:i})}setHoveredStep(i){this.updateState({hoveredStep:i})}clearHoveredStep(){this.setHoveredStep(null)}clearFocusedStep(){this.setFocusedStep(null)}updateState(i){this.stateSubject.next(A(A({},this.getState()),i))}setOptions(i){this.updateState(i)}setProfile(i){this.updateState({profile:i})}setOrigin(i){this.updateState({origin:i,hoverMarker:{}})}setDestination(i){this.updateState({destination:i,hoverMarker:{}})}clearOrigin(){this.updateState({origin:{value:null,label:""},originQuery:"",hoverWaypoints:[],directions:null})}clearDestination(){this.updateState({destination:{value:null,label:""},destinationQuery:"",hoverWaypoints:[],directions:null})}setError(i){this.updateState({error:i})}destroy(){this.stateSubject.next(wt)}};l.\u0275fac=function(n){return new(n||l)},l.\u0275prov=T({token:l,factory:l.\u0275fac,providedIn:"root"});let t=l;return t})();var wa=(()=>{let l=class l{constructor(){this._layers=new ce({intersections:!0,active:!0,axle:!1,alternative:!0,axleBbox:!1}),this.layers$=this._layers.asObservable()}get value(){return this._layers.value}update(i){this._layers.next(A(A({},this._layers.value),i))}};l.\u0275fac=function(n){return new(n||l)},l.\u0275prov=T({token:l,factory:l.\u0275fac,providedIn:"root"});let t=l;return t})();var Sa=(()=>{let l=class l{constructor(){this._state$=new ce({road:[]}),this.state$=this._state$.asObservable()}setSelection(i=[]){this._state$.next({road:i})}clear(){this._state$.next({road:[]})}};l.\u0275fac=function(n){return new(n||l)},l.\u0275prov=T({token:l,factory:l.\u0275fac,providedIn:"root"});let t=l;return t})();export{ni as a,Fs as b,Ji as c,el as d,hi as e,Ci as f,ol as g,ki as h,Kr as i,Vi as j,Mi as k,Jr as l,Li as m,xt as n,gs as o,ya as p,wa as q,Sa as r};
