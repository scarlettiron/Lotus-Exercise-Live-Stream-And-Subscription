import React from 'react'

function EnvelopePrimary() {
    return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          x='0'
          y='0'
          enableBackground='new 0 0 60 60'
          version='1.1'
          viewBox='0 0 60 60'
          xmlSpace='preserve'
        >
          <g fill='#b2cae2' fillOpacity='1'>
            <path d='M60 50.234L60 9.944 39.482 30.536z'></path>
            <path d='M0 9.941L0 50.234 20.519 30.535z'></path>
            <path d='M1.387 8.5l21.002 21.08c.121.051.471.415.517.519l5.941 5.963c.635.591 1.672.59 2.333-.025l5.911-5.933c.046-.105.4-.473.522-.524L58.615 8.5H1.387z'></path>
            <path d='M38.07 31.954l-5.5 5.52a3.777 3.777 0 01-2.58 1.019 3.705 3.705 0 01-2.533-.993l-5.526-5.546L1.569 51.5h56.862L38.07 31.954z'></path>
          </g>
        </svg>
      );
}

export default React.memo(EnvelopePrimary);