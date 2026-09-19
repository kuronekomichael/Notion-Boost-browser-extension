import { settingDetails } from './settings';
import { getElement, getLatestSettings } from './utils';
import { Fragment } from 'react';
import { t } from '@/components/i18n';

function isFuncEnabled(func: any) {
    const btnToDisable = getElement(`[data-func=${func}]`);

    if (btnToDisable && btnToDisable.classList.contains('enable')) {
        return true;
    }
    return false;
}

export function SettingsTable() {
    const [filterText, setFilterText] = useState('');
    const [settings, setSettings] = useState(settingDetails);

    useEffect(() => {
        refreshSettings();
    }, []);

    const refreshSettings = () => {
        console.log('refreshing settings');
        const obj = [...settingDetails];

        getLatestSettings()
            .then((set: any) => {
                console.log('LatestSettings: ', set);

                // add current status to settings object
                obj.forEach((e: any) => {
                    e.status = set[e.func] ? 'enable' : 'disable';
                });

                setSettings([...obj]);

                return null;
            })
            .catch((e) => console.log(e));
    };

    const handleFeature = useCallback((obj: any) => {
        console.log('obj', obj);

        console.log('clicked: ');

        const func = obj.func;
        const funcToDisable = obj.disable_func;

        let toEnable = false;

        if (obj.status === 'enable') {
            toEnable = false;
        } else {
            toEnable = true;
        }

        try {
            getLatestSettings()
                .then((set: any) => {
                    console.log('getLatestSettings ->', set);
                    set[func] = toEnable;
                    set.call_func = {
                        name: func,
                        arg: toEnable,
                    };

                    // disable other related func if both are enabled
                    if (funcToDisable && isFuncEnabled(funcToDisable) && toEnable) {
                        set[funcToDisable] = false;
                    }

                    browser.storage.sync.set({ nb_settings: set }).then(() => {
                        refreshSettings();
                    });
                    return null;
                })
                .catch((e) => console.log(e));
        } catch (e) {
            console.log(e);
        }
    }, []);

    const getLocalizedName = (item: (typeof settingDetails)[number]) => t(`setting_${item.func}_name`);
    const getLocalizedDescription = (item: (typeof settingDetails)[number]) =>
        item.desc ? t(`setting_${item.func}_desc`) : '';

    const filteredItems = settings.filter((item) => {
        const searchableText = [item.name, item.desc, getLocalizedName(item), getLocalizedDescription(item)]
            .join(' ')
            .toLocaleLowerCase();

        return searchableText.includes(filterText);
    });
    console.log('filtered items', filteredItems);

    const itemsToDisplay = filterText ? filteredItems : settings;

    const handleOnchange = (e: any) => {
        console.log('value changed');
        setFilterText(e.target.value.toLocaleLowerCase());
    };
    return (
        <>
            <input
                className="settings search"
                type="text"
                autoFocus
                value={filterText}
                aria-label={t('searchLabel')}
                placeholder={t('searchPlaceholder')}
                onInput={handleOnchange}
            />
            <div className="settings table">
                {!filteredItems.length && <div className="no-setting">{t('noSettingsFound')}</div>}
                {itemsToDisplay.map((obj, index) => (
                    <Fragment key={obj.func}>
                        <div
                            className={`row ${(obj as any).status}`}
                            data-func={obj.func}
                            data-disable_func={obj.disable_func}
                            onClick={() => handleFeature(obj)}>
                            <div className="text-wrapper">
                                <div className="name">{getLocalizedName(obj)}</div>
                                {obj.desc && <div className="desc">{getLocalizedDescription(obj)}</div>}
                            </div>
                            <div
                                className="button toggle"
                                role="button"
                                aria-disabled="false"
                                tabIndex={0}>
                                <div className="knob">
                                    <div className="pos" />
                                </div>
                            </div>
                        </div>
                        {/* {index === settingDetails.length - 1 ? (
                            <div className="divider last" />
                        ) : (
                            <div className="">
                                <div className="" />
                            </div>
                        )} */}
                    </Fragment>
                ))}
            </div>
        </>
    );
}
