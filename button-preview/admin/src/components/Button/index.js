import React, { useMemo, useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { Select, Option } from '@strapi/design-system/Select'
import { Flex, TextInput, Typography, Box } from '@strapi/design-system';
import { Dialog, DialogBody, DialogFooter, Button, Grid, GridItem, ToggleInput } from '@strapi/design-system';
import { useIntl } from 'react-intl'

const MultiSelect = ({
  value,
  onChange,
  name,
  intlLabel,
  required,
  attribute,
  description,
  placeholder,
  disabled,
  error,
}) => {


  const values = useMemo(() => {
    let dropValue
    try{
      dropValue = JSON.parse(value)
      return dropValue
    } catch {
      dropValue = ""
    }
  })

  const [content, setContent] = useState(values?.text || '');
  const [url, setUrl] = useState(values?.url || '');
  const [dropdownValue, setDropdownValue] = useState(values?.type || '')
  const [iconValue, setIconValue] = useState(values?.icon || 'none')
  const [expanded, setExpanded] = useState(false)
  const [checked, setChecked] = useState(values?.newTab || false)
  const isInitialMount = useRef(true);
  const { formatMessage } = useIntl()

  const possibleOptions = useMemo(() => {
    return (attribute['options']?.type || []).map((option) => {
      const [label, value] = [...option.split(':'), option]
      if (!label || !value) return null
      return { label, value }
    }).filter(Boolean)
  }, [attribute])

  const cssArray = attribute.options.css.split(",");
  const cleanedCssArray = cssArray.map(css => css.replace(/\s(?![\d#])/g, ''));
  function camelCase(str) {
    return str.replace(/[-_]+([a-zA-Z0-9])/g, (_, char) => char.toUpperCase());
  }

  const globalCss = attribute.options.global
    .replace("}", "")
    .split(/;\s*/)
    .filter(style => style.trim() !== "")
    .reduce((styleAcc, style) => {
        const [property, value] = style.split(":");
        const cleanedProperty = camelCase(property.trim());
        const cleanedValue = value.trim().replace(/^"(.*)"$/, "$1");
        return { ...styleAcc, [cleanedProperty]: cleanedValue };
    }, {});

  const cssObject = cleanedCssArray.reduce((acc, css) => {
    try{
      const [selector, styles] = css.split("{");
      const cleanedSelector = selector.replace(".", "");
      const cleanedStyles = styles
      .replace("}", "")
      .split(";")
      .filter(style => style.trim() !== "")
      .reduce((styleAcc, style) => {
        const [property, value] = style.split(":");
        const cleanedProperty = camelCase(property.trim());
        const cleanedValue = value.trim().replace(/^"(.*)"$/, "$1");
        return { ...styleAcc, [cleanedProperty]: cleanedValue };
      }, {});
      const mainArray = {
        ...cleanedStyles,
        ...globalCss
      }
      return { ...acc, [cleanedSelector]: mainArray };
    }catch(err){
      console.log(err);
    }
  }, {});

  useEffect(() => {
    if (!isInitialMount.current) {
      onChange({
        target: {
          name: name,
          value: JSON.stringify({
            type: dropdownValue, 
            text: content,
            icon: iconValue,
            url: url,
            newTab: checked
          }),
          type: attribute.type,
        },
      });
    } else {
      isInitialMount.current = false;
    }
  }, [dropdownValue, content, iconValue, url, checked]);

  const getIcon = (icon, preview) => {
    const color = preview ? dropdownValue === "primary" ? "#fff" : "#02132C" : "#02132C"
    if(icon === "arrow"){
      return (
        <svg width="7" height="9" viewBox="0 0 7 9" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M1.52636 0.578403C1.86514 0.409011 2.27055 0.445567 2.57357 0.67283L6.57357 3.67283C6.82538 3.86168 6.97357 4.15807 6.97357 4.47283C6.97357 4.78759 6.82538 5.08398 6.57357 5.27283L2.57357 8.27283C2.27055 8.50009 1.86514 8.53665 1.52636 8.36726C1.18757 8.19787 0.973572 7.8516 0.973572 7.47283V1.47283C0.973572 1.09406 1.18757 0.747795 1.52636 0.578403Z" fill={color}/>
        </svg>
      )
    }
  }

  return (
    <Box>
      <Box>
        <Typography variant="delta">{formatMessage(intlLabel)}</Typography>
      </Box>
      <Grid gap={2}>
        <GridItem padding={1} col={4} s={12}>
        <Select
            name="button-preview-type"
            id="button-preview-type"
            label="Type"
            error={
              error || (required && !possibleOptions.length ? 'No options' : null)
            }
            disabled={disabled || possibleOptions.length === 0}
            required={required}
            hint={description && formatMessage(description)}
            onChange={(v) => {
              setDropdownValue(v)
            }}
            placeholder={placeholder}
            value={dropdownValue}
            >
            {possibleOptions.map(({ label, value }) => (
              <Option value={value} key={value}>
                {label}
              </Option>
            ))}
          </Select>
        </GridItem>
        <GridItem padding={1} col={4} s={12}>
        <TextInput 
          required={required}
          placeholder="Enter the button text" 
          label="Text" 
          name="text" 
          onChange={(e) => {
            setContent(e.target.value)
          }}
          value={content} 
        />
        </GridItem>
        <GridItem padding={1} col={4} s={12}>
        <TextInput 
          required={required}
          placeholder="/home" 
          label="URL" 
          name="url" 
          onChange={(e) => {
            setUrl(e.target.value)
          }}
          value={url} 
        />
        </GridItem>
        <GridItem padding={1} col={5} s={12}>
          <Select
              name="button-preview-icon"
              id="button-preview-icon"
              label="Icon"
              disabled={disabled || possibleOptions.length === 0}
              required={required}
              hint={description && formatMessage(description)}
              onChange={(v) => {
                setIconValue(v)
              }}
              placeholder={placeholder}
              value={iconValue}
              >
              <Option value="none">None</Option>
              <Option value="arrow">
                <Typography>
                  {getIcon("arrow")}
                </Typography>
              </Option>
          </Select>
        </GridItem>
        <GridItem padding={1} col={5} s={12}>
        <ToggleInput label="New Tab" name="new-tab-provider" onLabel="True" offLabel="False" checked={checked} onChange={e => setChecked(e.target.checked)} />
        </GridItem>
        <GridItem alignItems="stretch" padding={1} col={2} s={12} style={{display: "flex", alignItems: "center", justifyContent: "center", height: "100%"}}>
            <Button disabled={dropdownValue === '' ? true : false} onClick={() => setExpanded(true)}>Live Preview</Button>
        </GridItem>
      </Grid>
    <Dialog onClose={() => setExpanded(false)} title="Live Preview" isOpen={expanded}>
            <DialogBody >
              <Flex direction="column" alignItems="center">
                <Flex justifyContent="center">
                  <button style={cssObject[dropdownValue]}>{content} {iconValue !== "none" ? getIcon("arrow", true) : null}</button>
                </Flex>
              </Flex>
            </DialogBody>
            <DialogFooter startAction={<Button onClick={() => setExpanded(false)} variant="tertiary">
                  Close
                </Button>} />
          </Dialog>
    </Box>
  )
}

MultiSelect.defaultProps = {
  description: null,
  disabled: false,
  error: null,
  labelAction: null,
  required: false,
  value: '',
}

MultiSelect.propTypes = {
  intlLabel: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  attribute: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.object,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  labelAction: PropTypes.object,
  required: PropTypes.bool,
  value: PropTypes.string,
}

export default MultiSelect
