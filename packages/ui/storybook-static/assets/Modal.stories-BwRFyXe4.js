import{j as e}from"./jsx-runtime-B1xBdNM5.js";import{B as d}from"./Button-CnInu37A.js";import"./Input-Bb4vJOHd.js";import{M as p}from"./EmptyState-CK3oAgTK.js";import"./index-BNzr4dE9.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./utils-kLi18cwj.js";import"./index-Br2yNiuN.js";const j={title:"Components/Modal",component:p,parameters:{layout:"centered"},tags:["autodocs"]},t={args:{title:"Modal Title",description:"This is a modal description explaining what this modal is for.",trigger:e.jsx(d,{children:"Open Modal"}),children:e.jsx("div",{className:"py-4",children:e.jsx("p",{children:"Modal content goes here."})})}},o={args:{title:"Simple Modal",trigger:e.jsx(d,{variant:"outline",children:"Open Simple Modal"}),children:e.jsx("div",{className:"py-4",children:e.jsx("p",{children:"This modal has no description."})})}};var i,r,a;t.parameters={...t.parameters,docs:{...(i=t.parameters)==null?void 0:i.docs,source:{originalSource:`{
  args: {
    title: 'Modal Title',
    description: 'This is a modal description explaining what this modal is for.',
    trigger: <Button>Open Modal</Button>,
    children: <div className="py-4">
        <p>Modal content goes here.</p>
      </div>
  }
}`,...(a=(r=t.parameters)==null?void 0:r.docs)==null?void 0:a.source}}};var s,n,l;o.parameters={...o.parameters,docs:{...(s=o.parameters)==null?void 0:s.docs,source:{originalSource:`{
  args: {
    title: 'Simple Modal',
    trigger: <Button variant="outline">Open Simple Modal</Button>,
    children: <div className="py-4">
        <p>This modal has no description.</p>
      </div>
  }
}`,...(l=(n=o.parameters)==null?void 0:n.docs)==null?void 0:l.source}}};const v=["Default","WithoutDescription"];export{t as Default,o as WithoutDescription,v as __namedExportsOrder,j as default};
