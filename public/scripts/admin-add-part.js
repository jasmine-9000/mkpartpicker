window.onload = () => {
    console.log('Admin page reached')
    const typeofPartSelector = document.getElementById('type-of-part');
    const chassisOptions = document.getElementById('chassis-options')
    const switchOptions = document.getElementById('switch-options');
    const lubeOptions = document.getElementById('lube-options');
    const keycapOptions = document.getElementById('keycap-options');
    const otherOptions = document.getElementById('other-options');
    typeofPartSelector.addEventListener('click', (e) => {
        // console.log('clicked');
        console.log(e.target.value);
        const componentType = e.target.value;
        switch(componentType) {
            case 'chassis':
                console.log('Switching to chassis options...')
                chassisOptions.classList.remove('hidden');
                switchOptions.classList.add('hidden')
                lubeOptions.classList.add('hidden')
                keycapOptions.classList.add('hidden');
                otherOptions.classList.add('hidden')
                break;
            case 'switches':
                console.log('Switching to switch options...');
                switchOptions.classList.remove('hidden')
                chassisOptions.classList.add('hidden');
                lubeOptions.classList.add('hidden')
                keycapOptions.classList.add('hidden');
                otherOptions.classList.add('hidden')
                break;
            case 'lube':
                console.log('Switching to lube options...');
                lubeOptions.classList.remove('hidden')
                chassisOptions.classList.add('hidden');
                switchOptions.classList.add('hidden')
                keycapOptions.classList.add('hidden');
                otherOptions.classList.add('hidden')
                break;
            case 'keycaps':
                console.log('Switching to keycap options...')
                keycapOptions.classList.remove('hidden');
                lubeOptions.classList.add('hidden')
                chassisOptions.classList.add('hidden');
                switchOptions.classList.add('hidden')
                otherOptions.classList.add('hidden')
                break;
            case 'other':
                console.log('Switching to other options...');
                otherOptions.classList.remove('hidden')
                keycapOptions.classList.add('hidden');
                lubeOptions.classList.add('hidden')
                chassisOptions.classList.add('hidden');
                switchOptions.classList.add('hidden')
                break;
            default:
                console.log('Not implemented');
                alert('Not implemented')
                break;
        }
    });
    
}